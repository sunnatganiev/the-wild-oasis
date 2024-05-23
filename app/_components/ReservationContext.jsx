'use client';
import React, { createContext, useContext, useState } from 'react';

const ReservationContext = createContext();

const initialState = { from: undefined, to: undefined };

export default function ReservationProvider({ children }) {
  const [range, setRange] = useState(initialState);
  const clearRange = () => setRange(initialState);

  const value = { range, setRange, clearRange };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservation() {
  const context = useContext(ReservationContext);
  if (context === undefined)
    throw new Error('ReservationContext is user outside of Provider');
  return context;
}
