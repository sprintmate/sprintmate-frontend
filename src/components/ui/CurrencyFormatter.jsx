import React from 'react';

const CurrencyFormatter = ({ currency, children,className = "" }) => {
  console.log('currnecy ', currency)
  const getCurrencySymbol = (currencyCode) => {
    try {
      // Using Intl.NumberFormat to get currency symbol
      const formatter = new Intl.NumberFormat('en', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });

      // Extract the currency symbol from formatted parts
      const currencyParts = formatter.formatToParts(0);
      const currencySymbol = currencyParts.find(part => part.type === 'currency')?.value || currencyCode;
      return currencySymbol;
    } catch (error) {
      console.error('Error formatting currency:', error);
      return currencyCode; // Default to currency code if error occurs
    }
  };

  const currencySymbol = getCurrencySymbol(currency);

  return (
    <span className= {className} >
      {currencySymbol} {children}
    </span>
  );
};

export default CurrencyFormatter;