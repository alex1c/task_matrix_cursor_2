import React, { useEffect } from 'react';

/**
 * Google AdSense Ad Component
 * Place this component where you want to display Google AdSense ads
 * 
 * @param {string} adSlot - Your AdSense ad slot ID (e.g., "1234567890")
 * @param {string} adFormat - Ad format (e.g., "auto", "rectangle", "horizontal")
 * @param {boolean} fullWidthResponsive - Enable full-width responsive ads
 */
export const GoogleAdSense = ({ 
	adSlot, 
	adFormat = 'auto',
	fullWidthResponsive = true 
}) => {
	useEffect(() => {
		try {
			// Push ad to AdSense
			((window.adsbygoogle = window.adsbygoogle || [])).push({});
		} catch (err) {
			console.error('AdSense error:', err);
		}
	}, []);

	if (!adSlot) {
		return null;
	}

	return (
		<div className='my-8 flex justify-center'>
			<ins
				className='adsbygoogle'
				style={{ display: 'block' }}
				data-ad-client='ca-pub-XXXXXXXXXXXXXXXX'
				data-ad-slot={adSlot}
				data-ad-format={adFormat}
				data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
			/>
		</div>
	);
};

/**
 * Yandex.Direct Ad Component
 * Place this component where you want to display Yandex.Direct ads
 * 
 * @param {string} blockId - Your Yandex.Direct block ID (e.g., "R-A-123456-1")
 */
export const YandexDirect = ({ blockId }) => {
	if (!blockId) {
		return null;
	}

	return (
		<div className='my-8 flex justify-center'>
			<div id={`yandex-rtb-${blockId}`}></div>
		</div>
	);
};

export default GoogleAdSense;

