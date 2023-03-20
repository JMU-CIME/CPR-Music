import { WaveSurfer,WaveForm } from 'wavesurfer-react';

function WaveDisplay() {
  return (
    <WaveSurfer>
      <WaveForm responsive id="waveform" cursorColor="transparent"></WaveForm>
    </WaveSurfer>
  );
}

export default WaveDisplay;
