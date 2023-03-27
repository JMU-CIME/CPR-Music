// import { WaveSurfer,WaveForm } from 'wavesurfer-react';
import WaveSurfer from "wavesurfer.js";
import { FaPlay, FaPause } from "react-icons/fa";
import { WaveformContianer, Wave } from "./Waveform.styled";
import Button from 'react-bootstrap/Button';
import { useEffect, useRef, useState } from 'react';

export function WaveDisplay({ audioFile }) {
  const [playing, setPlaying] = useState(false);
  // const [refId, setRefId] = useState();
  const waveRef = useRef();
  const [waveObj, setWaveObj] = useState();

  useEffect(() => {
    if(waveRef && !waveObj){
      setWaveObj(WaveSurfer.create({
        barWidth: 3,
        barRadius: 3,
        barGap: 2,
        barMinHeight: 1,
        cursorWidth: 1,
        container: waveRef.current,
        backend: "WebAudio",
        height: 80,
        progressColor: "#450084",
        responsive: true,
        waveColor: "#C4C4C4",
        cursorColor: "transparent"
      }));
    
      console.log(
        "waveRef", waveRef,
        "waveObj", waveObj
      )
      if(waveObj)
        waveObj.load(audioFile);
    }

  }, [waveRef, audioFile]);

  useEffect(() => {
    if (waveObj) {
      waveObj.on('finish', () => {
        setPlaying(false);
        waveObj.pause();
        waveObj.seekTo(0);
      });
    }
  });

  const handlePlay = () => {
    setPlaying(!playing);
    waveObj.playPause();
  };

  return (
    <WaveformContianer ref={waveRef}>
      <Button onClick={handlePlay}>
        {!playing ? <FaPlay /> : <FaPause />}
      </Button>
      <Wave id="waveform" />
      <audio id="track" src={audioFile} />
    </WaveformContianer>
  );
}

export default WaveDisplay;
