// import { WaveSurfer,WaveForm } from 'wavesurfer-react';
import WaveSurfer from "wavesurfer.js";
import { FaPlay, FaPause } from "react-icons/fa";
import { WaveformContianer, Wave } from "./Waveform.styled";
import Button from 'react-bootstrap/Button';
import { useEffect, useRef, useState } from 'react';

export function WaveDisplay({ audioFile }) {
  const [playing, setPlaying] = useState(false);
  var waveform = useRef(null);

  useEffect(() => {
    waveform.current = WaveSurfer.create({
      barWidth: 3,
      barRadius: 3,
      barGap: 2,
      barMinHeight: 1,
      cursorWidth: 1,
      container: "#waveform",
      backend: "WebAudio",
      height: 80,
      progressColor: "#FE6E00",
      responsive: true,
      waveColor: "#C4C4C4",
      cursorColor: "transparent"
    });

    waveform.current.load(audioFile);
  }, []);

  useEffect(() => {
    if (waveform.current) {
      waveform.current.on('finish', () => {
        setPlaying(false);
        waveform.current.pause();
        waveform.current.seekTo(0);
      });
    }
  });

  const handlePlay = () => {
    setPlaying(!playing);
    waveform.current.playPause();
  };

  return (
    // <div>jeff</div>
    <WaveformContianer>
      <Button onClick={handlePlay}>
        {!playing ? <FaPlay /> : <FaPause />}
      </Button>
      <Wave id="waveform" />
      <audio id="track" src={audioFile} />
    </WaveformContianer>
  );
}

export default WaveDisplay;
