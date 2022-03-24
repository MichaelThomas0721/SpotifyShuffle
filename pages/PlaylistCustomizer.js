import React, { createContext, useEffect, useRef, useState } from "react";
import Song from "../Components/Song";
import { useRouter } from "next/router";


export default function PlaylistList() {
  //variables stored in state or ref
  const [list, setList] = useState([]);
  const hours = useRef(0);
  const minutes = useRef(0);
  const desiredTime = useRef(0);
  const songTime = useRef(0);
  const totalSongs = useRef(0);
  const percentages = useRef(new Map());
  const durations = useRef(new Map());
  const [defaultValue, setDefaultValue] = useState(0);
  const router = useRouter();

  //async function to generate a playlist on the button click
  async function generatePlaylist() {
    //get the desired time from the ref that hold the time from the two inputs for hour and minutes
    let total = desiredTime.current;
    //makes a sorted list for the algorithm
    let songList = [];
    let sorted = new Map(
      [...percentages.current.entries()].sort((a, b) => b[1] - a[1])
    );

    //algorithm to shuffle based on the percents, generaes a random number and if that number falls between a range a number is selected
    let keyArr = Array.from(sorted.keys());
    for (let i = 0; total > 0 && i <= keyArr.length; i++) {
      if (sorted.get(keyArr[i]) >= Math.random() * 100) {
        songList.push(keyArr[i]);
        total -= durations.current.get(keyArr[i]);
      } 
      if (parseInt(sorted.get(keyArr[i])) > 0){
          keyArr = keyArr.filter(f => f !== keyArr[i]);
          i--;
      } else {
        break;
      }
    }

    //this will run if the songs with set percentages don't fill the desired time
    while (total > 0 && keyArr.length > 0) {
      let random = Math.floor(Math.random() * keyArr.length);
      let rand = keyArr[random];
      songList.push(rand);
      keyArr = keyArr.filter(f => f !== rand);
      total -= durations.current.get(rand);
    }

    //shuffles the list to ensure the high percent songs don't stay at the top
    songList = songList
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    //gets user id and creates an empty playlist to populate
    let userId = await fetchUserId();
    let playlistDetails = await createEmptyPlaylist(userId.id);
    let resp = await addSongs(playlistDetails.id, songList)
    router.push({ pathname: "https://open.spotify.com/playlist/" + playlistDetails.id });
  }

  //function for fetching user id from spotify api
  async function fetchUserId() {
    try {
      const res = await fetch("/api/user");
      const item = await res.json();
      console.log(item);
      return item;
    } catch (e) {
      console.log(e);
    }
  }

  //function for creating an empty playlist with spotify api
  async function createEmptyPlaylist(userId) {
    try {
      const res = await fetch("/api/createPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId }),
      });
      const item = await res.json();
      return item;
    } catch (e) {
      console.log(e);
    }
  }

  //function to populate playlist with shuffled song list
  async function addSongs(playlistId, songlist) {
    //sets the uri info to be passed in post request
    let uriInfo = [];
    for (let song in songlist) {
      uriInfo.push("spotify:track:" + songlist[song]);
    }
    try {
      const res = await fetch("/api/fillPlaylist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlistId: playlistId, data: uriInfo }),
      });
      const item = await res.json();
      return item;
    } catch (e) {
      console.log(e);
    }
  }

  //function for storing individual song percents
  function updatePercentages(id, newPercent) {
    percentages.current.set(id, newPercent);
  }

  //function to calculate the total length of the original playlist (used for calculating estimated percentages)
  function getSongTimes(id, moreTime) {
    totalSongs.current = totalSongs.current + 1;
    songTime.current = songTime.current + moreTime;
    durations.current.set(id, moreTime);
  }

  //updates the desired time when the minutes or hours change
  function timeChange(id, value) {
    //determines if call was from minutes or hours
    if (id == 1) {
      hours.current = value;
    } else {
      minutes.current = value;
    }

    //updates desired time (ms) from hours and minutes
    desiredTime.current =
      (hours.current * 60 + parseInt(minutes.current)) * 60000;
    updateDefaultPercent(desiredTime.current);
  }

  //function for updating the hints for the song inputs
  function updateDefaultPercent(desiredTime) {
    setDefaultValue(
      ((desiredTime / (songTime.current / totalSongs.current)) * 100) /
        totalSongs.current
    );
  }

  //calls fetchSongs() on load
  useEffect(() => {
    fetchSongs();
  }, []);

  //function that gets the song details and maps them
  async function fetchSongs() {
    //post request to get information
    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playlistId: sessionStorage.getItem("playlistId"),
        }),
      });
      const { items } = await res.json();
      //map to html elements
      setList(
        items.map((item) => {
          return (
            <Song
              key={item.track.id}
              title={item.track.name}
              artist={item.track.artists[0].name}
              setPercentages={updatePercentages}
              getSongTimes={getSongTimes}
              id={item.track.id}
              defaultPercent={defaultValue}
              duration={item.track.duration_ms}
            />
          );
        })
      );
    } catch (e) {
      console.log(e);
    }
  }

  //This is what the page displays
  return (
    <div className="bg-black">
      <h1 className="text-white text-center text-5xl mt-3">
        Customize Playlist
      </h1>
      <div className="mt-9 w-fit m-auto">
        <label htmlFor="time_hours" className="text-white mx-3">
          Hours
        </label>
        <input
          type="number"
          min="-1"
          max="1000"
          step="1"
          name="hours"
          id="time_hours"
          onChange={(evt) => timeChange(1, evt.target.value)}
        />
        <label htmlFor="time_minutes" className="text-white mx-3">
          Minutes
        </label>
        <input
          type="number"
          min="-1"
          max="60"
          step="1"
          name="minutes"
          id="time_minutes"
          onChange={(evt) => timeChange(2, evt.target.value)}
        />
      </div>
      <div className="w-fit m-auto">
        <button
          className="text-white bg-green-500 rounded p-2 my-7 m-auto hover:bg-green-700"
          onClick={() => generatePlaylist()}
        >
          Generate Playlist
        </button>
      </div>

      <div className="flex flex-wrap flex-row justify-center">{list}</div>
    </div>
  );
}
