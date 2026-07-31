import React from 'react';

export default function EwasteMapIframe({
  height = '500px',
  mid = '1ySyBcuorBk9s4c59jRkJhceMATM3fF2b',
}) {
  const mapSrc = `https://www.google.com/maps/d/u/0/embed?mid=${mid}&z=11&ll=1.3521%2C103.8198`;

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <iframe
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Singapore E-Waste Collection Points Map"
      />
    </div>
  );
}
