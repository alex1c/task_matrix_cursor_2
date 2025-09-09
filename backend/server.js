const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());

// Обслуживание статических файлов (включая файлы переводов)
app.use(express.static('frontend/public'));

// Инициализация базы данных
const db = new sqlite3.Database('./database.sqlite', (err) => {
	if (err) {
	} else {
		initDatabase();
	}
});

// Создание таблиц
function initDatabase() {
	db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

	db.run(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      quadrant TEXT NOT NULL,
      priority TEXT NOT NULL,
      due_date TEXT,
      completed BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )
  `);
}

// Middleware для получения или создания пользователя
function getUser(req, res, next) {
	let userId = req.cookies.userId || req.headers['x-user-id'];

	if (!userId) {
		userId = uuidv4();
		res.cookie('userId', userId, {
			maxAge: 365 * 24 * 60 * 60 * 1000, // 1 год
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		});

		// Создаем нового пользователя в БД
		db.run('INSERT OR IGNORE INTO users (id) VALUES (?)', [userId]);
	}

	req.userId = userId;
	next();
}

// Маршруты API

// Получить все задачи пользователя
app.get('/api/tasks', getUser, (req, res) => {
	const { userId } = req;

	db.all(
		'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
		[userId],
		(err, rows) => {
			if (err) {
				return res.status(500).json({ error: 'Database error' });
			}
			res.json(rows);
		}
	);
});

// Создать новую задачу
app.post('/api/tasks', getUser, (req, res) => {
	const { userId } = req;
	const { title, description, quadrant, priority, dueDate, completed } =
		req.body;

	if (!title || !quadrant || !priority) {
		return res.status(400).json({ error: 'Missing required fields' });
	}

	const taskId = uuidv4();
	const now = new Date().toISOString();

	db.run(
		`INSERT INTO tasks (id, user_id, title, description, quadrant, priority, due_date, completed, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		[
			taskId,
			userId,
			title,
			description || '',
			quadrant,
			priority,
			dueDate || null,
			completed || false,
			now,
			now,
		],
		function (err) {
			if (err) {
				return res.status(500).json({ error: 'Database error' });
			}

			// Возвращаем созданную задачу
			db.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, row) => {
				if (err) {
					return res.status(500).json({ error: 'Database error' });
				}
				res.status(201).json(row);
			});
		}
	);
});

// Обновить задачу
app.put('/api/tasks/:id', getUser, (req, res) => {
	const { userId } = req;
	const { id } = req.params;
	const updates = req.body;

	// Проверяем, что задача принадлежит пользователю
	db.get(
		'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
		[id, userId],
		(err, task) => {
			if (err) {
				return res.status(500).json({ error: 'Database error' });
			}

			if (!task) {
				return res.status(404).json({ error: 'Task not found' });
			}

			const now = new Date().toISOString();
			const updateFields = [];
			const updateValues = [];

			// Строим динамический запрос обновления
			Object.keys(updates).forEach((key) => {
				if (
					[
						'title',
						'description',
						'quadrant',
						'priority',
						'dueDate',
						'completed',
					].includes(key)
				) {
					updateFields.push(
						`${key === 'dueDate' ? 'due_date' : key} = ?`
					);
					updateValues.push(updates[key]);
				}
			});

			if (updateFields.length === 0) {
				return res
					.status(400)
					.json({ error: 'No valid fields to update' });
			}

			updateFields.push('updated_at = ?');
			updateValues.push(now);
			updateValues.push(id, userId);

			const query = `UPDATE tasks SET ${updateFields.join(
				', '
			)} WHERE id = ? AND user_id = ?`;

			db.run(query, updateValues, function (err) {
				if (err) {
					return res.status(500).json({ error: 'Database error' });
				}

				// Возвращаем обновленную задачу
				db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
					if (err) {
						return res
							.status(500)
							.json({ error: 'Database error' });
					}
					res.json(row);
				});
			});
		}
	);
});

// Переместить задачу между квадрантами
app.put('/api/tasks/:id/move', getUser, (req, res) => {
	const { userId } = req;
	const { id } = req.params;
	const { quadrant } = req.body;

	if (!quadrant) {
		return res.status(400).json({ error: 'Quadrant is required' });
	}

	const now = new Date().toISOString();

	db.run(
		'UPDATE tasks SET quadrant = ?, updated_at = ? WHERE id = ? AND user_id = ?',
		[quadrant, now, id, userId],
		function (err) {
			if (err) {
				return res.status(500).json({ error: 'Database error' });
			}

			if (this.changes === 0) {
				return res.status(404).json({ error: 'Task not found' });
			}

			// Возвращаем обновленную задачу
			db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
				if (err) {
					return res.status(500).json({ error: 'Database error' });
				}
				res.json(row);
			});
		}
	);
});

// Удалить задачу
app.delete('/api/tasks/:id', getUser, (req, res) => {
	const { userId } = req;
	const { id } = req.params;

	db.run(
		'DELETE FROM tasks WHERE id = ? AND user_id = ?',
		[id, userId],
		function (err) {
			if (err) {
				return res.status(500).json({ error: 'Database error' });
			}

			if (this.changes === 0) {
				return res.status(404).json({ error: 'Task not found' });
			}

			res.status(204).send();
		}
	);
});

// Экспорт задач в CSV
app.get('/api/tasks/export', getUser, (req, res) => {
	const { userId } = req;

	db.all(
		'SELECT * FROM tasks WHERE user_id = ? ORDER BY quadrant, priority DESC',
		[userId],
		(err, tasks) => {
			if (err) {
				return res.status(500).json({ error: 'Database error' });
			}

			const csvWriter = createCsvWriter({
				path: 'temp-tasks.csv',
				encoding: 'utf8',
				header: [
					{ id: 'title', title: 'Название' },
					{ id: 'description', title: 'Описание' },
					{ id: 'quadrant', title: 'Квадрант' },
					{ id: 'priority', title: 'Приоритет' },
					{ id: 'dueDate', title: 'Дата выполнения' },
					{ id: 'completed', title: 'Выполнено' },
					{ id: 'createdAt', title: 'Дата создания' },
				],
			});

			const records = tasks.map((task) => ({
				title: task.title,
				description: task.description || '',
				quadrant: getQuadrantLabel(task.quadrant),
				priority: getPriorityLabel(task.priority),
				dueDate: task.due_date || '',
				completed: task.completed ? 'Да' : 'Нет',
				createdAt: new Date(task.created_at).toLocaleDateString(
					'ru-RU'
				),
			}));

			csvWriter
				.writeRecords(records)
				.then(() => {
					// Устанавливаем заголовки для UTF-8
					res.setHeader('Content-Type', 'text/csv; charset=utf-8');
					res.setHeader(
						'Content-Disposition',
						'attachment; filename="eisenhower-matrix-tasks.csv"'
					);

					res.download(
						'temp-tasks.csv',
						'eisenhower-matrix-tasks.csv',
						(err) => {
							if (err) {
							}
							// Удаляем временный файл
							require('fs').unlinkSync('temp-tasks.csv');
						}
					);
				})
				.catch((err) => {
					res.status(500).json({ error: 'Export error' });
				});
		}
	);
});

// Вспомогательные функции
function getQuadrantLabel(quadrant) {
	const labels = {
		'urgent-important': 'Важно и Срочно',
		'important-not-urgent': 'Важно, но не Срочно',
		'urgent-not-important': 'Срочно, но не Важно',
		'not-urgent-not-important': 'Не Важно и не Срочно',
	};
	return labels[quadrant] || quadrant;
}

function getPriorityLabel(priority) {
	const labels = {
		high: 'Высокий',
		medium: 'Средний',
		low: 'Низкий',
	};
	return labels[priority] || priority;
}

// Обработка ошибок
app.use((err, req, res, next) => {
	res.status(500).json({ error: 'Something broke!' });
});

// Запуск сервера
app.listen(PORT, () => {});

// Graceful shutdown
process.on('SIGINT', () => {
	db.close((err) => {
		if (err) {
		} else {
		}
		process.exit(0);
	});
});
