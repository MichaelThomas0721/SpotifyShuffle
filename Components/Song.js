import { useEffect } from "react";
export default function Song(props) {
  //get information passed through from the playlistcustomizer page
  const id = props.id;
  const title = props.title;
  const artist = props.artist;
  const defaultValue = props.defaultPercent;
  const getSongTimes = props.getSongTimes;
  const duration = props.duration;

  //update the percentages that are stored on the playlistcustomizer page
  function changePercentages(value) {
    props.setPercentages(id, value);
  }

  //called to update the percentages and total song time on load
  useEffect(() => {
    changePercentages(0);
    getSongTimes(id, duration);
  }, []);

  //this is what the page displays
  return (
    <div className="bg-darkGrey rounded-2xl p-4 m-3 w-52 aspect-auto overflow-hidden text-ellipsis text-center">
      <h1 className="text-green-500">{title}</h1>
      <h1 className="text-green-500">{artist}</h1>
      <input
        className="right-0"
        onChange={(evt) => changePercentages(evt.target.value)}
        type="number"
        placeholder={defaultValue}
      ></input>
    </div>
  );
}
