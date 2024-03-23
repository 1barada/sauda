'use client'

import { BASE_URL } from '@/utils/constants';
import { useState } from 'react'

export default function page() {
  const [file, setFile] = useState<File | undefined>(undefined);

  async function handleSubmit() {
    if (!file) return; 

    const formData = new FormData();
    formData.append('song', file);

    const response = await fetch(BASE_URL + '/api/author', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    console.log(data)
  }

  return (
    <div>
      <input type="file" accept='audio/mpeg' onChange={(e) => setFile(e.target.files?.[0] || undefined)}/>
      <button onClick={handleSubmit}>submit</button>
    </div>
  )
}
