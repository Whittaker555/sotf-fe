'use client'
import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Home() {
  const { data: session } = useSession(); 
  const [playlists, setPlaylists] = useState<string[]>();

  if(session){
    fetch('https://api.spotify.com/v1/me/playlists', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`
      }
    }).then(response => {
      if(response.status === 401){
        signOut()
      } else if(response.status === 200){
        response.json().then(data => {
          setPlaylists(data.items.map((playlist: any) => playlist.name))
        })
      }
    })
  }

  if (session) {
    return (
      <div className="p-6">
        <p className="text-white font-normal text-xl mt-5 mb-2">Signed In as</p>
        <span className="bold-txt">{session?.user?.name}</span>
        <p className="text-white font-normal text-xl mt-5 mb-2">Playlists</p>
        {playlists?.map((playlist) => (
          <p key={playlist} className="text-white font-normal text-xl mt-5 mb-2">
            - {playlist}
          </p>
        ))}
        <p
          className="opacity-70 mt-8 mb-5 underline cursor-pointer"
          onClick={() => signOut()}
        >
          Sign Out
        </p>
      </div>
    );
  } else {
    return (
      <div>
        <button
          onClick={() => signIn()}
          className="shadow-primary w-56 h-16 rounded-xl bg-white border-0 text-black text-3xl active:scale-[0.99] m-6"
        >
          Sign In
        </button>
      </div>
    );
  }
}
