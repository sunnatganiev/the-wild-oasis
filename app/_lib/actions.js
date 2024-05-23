'use server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth, signIn, signOut } from '@/app/_lib/auth';
import { supabase } from '@/app/_lib/supabase';

export async function signInAction() {
  //   const providers = await fetch('http://localhost:3000/api/auth/providers')
  //     .then((res) => res.json())
  //     .then((data) => data);
  //   console.log(Object.keys(providers));

  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const nationalID = formData.get('nationalID');
  // const [nationality, countryFlag] = formData.get('nationality').split('%');

  const updateData = { nationalID };

  const { data, error } = await supabase
    .from('guests')
    .update(updateData)
    .eq('id', session.user.guestId)
    .select()
    .single();

  if (error) throw new Error('Guest could not be updated');

  revalidatePath('/account/profile');
}

export async function deleteReservation(bookingId) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const { error } = await supabase
    .from('bookings')
    .delete()
    .eq('id', bookingId);

  if (error) throw new Error('Booking could not be deleted');
  revalidatePath('/account/reservations');
}

export async function updateBooking(formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const { bookingId, numGuests, observations } = Object.fromEntries(formData);

  const updateData = { numGuests: +numGuests, observations };

  const { error } = await supabase
    .from('bookings')
    .update(updateData)
    .eq('id', +bookingId)
    .select()
    .single();

  if (error) throw new Error('Booking could not be updated');

  revalidatePath('/account/reservations');
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  redirect('/account/reservations');
}

export async function createBooking(bookingData, formData) {
  const session = await auth();
  if (!session) throw new Error('You must be logged in');

  const newBooking = {
    ...bookingData,
    guestId: session.user.guestId,
    numGuests: +formData.get('numGuests'),
    observations: formData.get('observations').slice(0, 1000),
    extrasPrice: 0,
    totalPrice: bookingData.cabinPrice,
    isPaid: false,
    hasBreakfast: false,
    status: 'unconfirmed',
  };

  const { error } = await supabase.from('bookings').insert([newBooking]);

  if (error) {
    throw new Error('Booking could not be created');
  }

  revalidatePath(`/cabins/${bookingData.cabinId}`);
  redirect('/cabins/thankyou');
}
