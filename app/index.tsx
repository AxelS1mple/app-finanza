// app/index.tsx
import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // Redirige a la página de login de forma automática
  return <Redirect href="/login" />;
}
