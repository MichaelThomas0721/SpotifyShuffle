import React, { useEffect, useState } from "react"
import axios from "axios";
import useAuth from "../utils/useAuth";

export default function PlaylistList({ code }){
    const accessToken = useAuth(code);

    
    useEffect(() => {
        axios.get("https://api.spotify.com/v1/me/playlists").then(res => {
            console.log(res);
        })
        .catch(() => {
            //window.location = "/";
        })
    }, [code])

    return (
        <div>
            <h1>Playlist List</h1>
        </div>
    )
}