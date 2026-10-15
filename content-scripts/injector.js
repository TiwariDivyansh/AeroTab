/**
 * AeroTab Content Script Injector
 * Applies ambient Frutiger Aero aesthetic enhancements into popular web pages.
 */

(function() {
  'use strict';

  // Add signature AeroTab badge indicator in console
  console.log(
    '%c🌊 AeroTab Skin Active %c Frutiger Aero Browser Suite',
    'background: #00b4d8; color: #fff; font-weight: bold; padding: 3px 6px; border-radius: 4px;',
    'color: #0284c7; font-weight: 600;'
  );

  // Add Aero class to document root
  document.documentElement.classList.add('aerotab-skin-applied');
})();
