function reverseFlatScore(orig) {
  console.log('orig', orig);
  if (!orig || !Object.hasOwn(orig, 'score-partwise')) return null;
  console.log('orig', JSON.stringify(orig));
  const reversed = JSON.parse(JSON.stringify(orig));
  const origMeasures = reversed?.['score-partwise']?.part?.[0]?.measure;
  const reverseNotesInMeasure = (measure) => {
    const notes = measure.note;

    const simplifiedNotes = notes.map((note, i) => {
      let timePos = 0;
      const result = {};
      timePos += note.duration;
      result.staff = note.staff;
      result.voice = note.voice;
      result.duration = note.duration;
      result.pitch = note.pitch;
      result.type = note.type;
      let beamContent = 'end';
      if (note.beam) {
        if (note.beam.content === 'end') {
          beamContent = 'begin';
        }
        result.beam = { ...note.beam, content: beamContent };
      }
      return result;
    });
    const reversedNotes = simplifiedNotes.reverse();
    const setAdagioLocations = (notes) => {
      let timePos = 0;
      notes.forEach((note) => {
        note['$adagio-location'] = { timePos };
        timePos += parseInt(note.duration);
      });
      return notes;
    };
    const reversedNotesWithLocations = setAdagioLocations(reversedNotes);
    console.log('reversedNotes', reversedNotesWithLocations);
    return { ...measure, note: reversedNotesWithLocations };
  };
  const reversedMeasures = origMeasures.map(reverseNotesInMeasure);
  reversed['score-partwise'].part[0].measure = reversedMeasures;
  console.log('reversed', JSON.stringify(reversed));
  return reversed;
}

function rhythmicShift(orig, shiftEighths) {
  console.log('orig for shifting', JSON.stringify(orig), shiftEighths);
  // console.log('orig', JSON.stringify(orig))
  const shifted = JSON.parse(JSON.stringify(orig));
  const origMeasures = shifted['score-partwise'].part[0].measure;
  const shiftNotesInMeasure = (measure, eighths) => {
    console.log('measure to shift', measure, eighths);
    const notes = measure.note;
    const simplifiedNotes = notes.map((note, i) => {
      const result = {};
      result.staff = note.staff;
      result.voice = note.voice;
      result.duration = note.duration;
      result.pitch = note.pitch;
      result.type = note.type;
      return result;
    });

    for (let i = 0; i < eighths; i++) {
      console.log('simplifiedNotes for shift', simplifiedNotes);
      // do we need to split the last note?
      if (simplifiedNotes[simplifiedNotes.length - 1].duration > 1) {
        const lastNote = simplifiedNotes[simplifiedNotes.length - 1];
        console.log('splitting last note', lastNote);
        const splitNote = {
          ...lastNote,
          duration: 1,
        };
        const remainderNote = {
          ...lastNote,
          duration: lastNote.duration - 1, // FIXME: is this a reasonable assumption? like what if the last note is duration 4 (a half note)? is there a note with duration 3 to leave at the end of the measure?
        };
        console.log(splitNote, remainderNote);
        simplifiedNotes[simplifiedNotes.length - 1] = remainderNote;
        simplifiedNotes.push(splitNote);
      }

      simplifiedNotes.unshift(simplifiedNotes.pop());
    }

    const shiftededNotes = simplifiedNotes;
    const setAdagioLocations = (notes) => {
      let timePos = 0;
      notes.forEach((note) => {
        note['$adagio-location'] = { timePos };
        timePos += parseInt(note.duration);
      });
      return notes;
    };
    const shiftededNotesWithLocations = setAdagioLocations(shiftededNotes);
    console.log('shiftededNotes', shiftededNotesWithLocations);
    return { ...measure, note: shiftededNotesWithLocations };
  };
  const shiftedMeasures = origMeasures.map((m) =>
    shiftNotesInMeasure(m, shiftEighths)
  );
  shifted['score-partwise'].part[0].measure = shiftedMeasures;
  console.log('shifted', JSON.stringify(shifted));
  return shifted;
}

function melodicShift(orig, amountToShift) {
  const shifted = JSON.parse(JSON.stringify(orig));
  const origMeasures = shifted['score-partwise'].part[0].measure;

  const shiftNotesInMeasure = (measure, amountToShift) => {
    const notes = measure.note;
    pitches = [];
    console.log('notes', notes);
    // Saves pitches so we don't overwrite accidently
    for (let i = 0; i < notes.length; i++) {
      pitches.push(notes[i].pitch);
    }
    // Moves the pitches based on the amount of notes (i.e amountToShift = 1 means shift by 1 note)
    const setPitches = (notes, amountToShift) => {
      for (let i = 0; i < notes.length; i++) {
        console.log('current Pitch', notes[i].pitch);
        console.log(
          'new pitch',
          pitches[(i + amountToShift + notes.length) % notes.length]
        );
        notes[i].pitch =
          pitches[(i + amountToShift + notes.length) % notes.length];
      }
      return notes;
    };

    const changedPitches = setPitches(notes, amountToShift);
    console.log('changedPtiches', changedPitches);
    return { ...measure, note: changedPitches };
  };
  const shiftedMeasures = origMeasures.map((m) =>
    shiftNotesInMeasure(m, amountToShift)
  );
  shifted['score-partwise'].part[0].measure = shiftedMeasures;
  console.log('shifted', JSON.stringify(shifted));
  return shifted;
}

// Successfully coalesces notes when necessary. Needs to be checked with different time signatures
// (also more than one measure?)
function mwRhythmicShift(orig, shift) {
  let pitchList = [];
  const shiftedTemplate = JSON.parse(JSON.stringify(orig));

  let numNotes =
    shiftedTemplate['score-partwise'].part[0].measure[0].note.length;
  let beats =
    shiftedTemplate['score-partwise'].part[0].measure[0].attributes[0].time
      .beats;
  let subdivision =
    shiftedTemplate['score-partwise'].part[0].measure[0].attributes[0]
      .divisions;
  let adjustedShift = Math.ceil(shift / subdivision);
  let maxNotes = beats * subdivision;
  pitchList = [...shiftedTemplate['score-partwise'].part[0].measure[0].note];
  // may also need to use the 'beat' property depending on how much automation flat does

  // the notes that need to be checked for split
  let checkList = pitchList.splice(numNotes - adjustedShift);

  // increment the notes' timepos with <shift> + new propertes to aid with coalesce
  const nonSplitIncrement = (note) => {
    note['oPos'] = note['$adagio-location'].timePos;
    note['$adagio-location'].timePos += shift;
    note['uPos'] = note['$adagio-location'].timePos;

    // different increments for potential splits
    if (checkList.includes(note)) {
      note['$adagio-location'].timePos = note.uPos - note.oPos - shift;
    } else {
      note['$adagio-location'].timePos %= maxNotes;
    }

    return note;
  };
  pitchList = pitchList.map((n) => nonSplitIncrement(n));
  checkList = checkList.map((n) => nonSplitIncrement(n));

  // check the potentially splitting notes, and split if necessary.
  // coalescing is the 'default' for this version of the algo
  for (let note of checkList) {
    let diff = note.uPos - maxNotes;

    if (note.duration > shift || diff < 0) {
      let splitNote = JSON.parse(JSON.stringify(note));

      splitNote['$adagio-location'].timePos = splitNote.uPos;
      splitNote.duration -= 1;
      note.duration -= 1;

      pitchList.push(splitNote);
    }
  }

  // concatenate the checked notes list and the 'middle' notes list, then update the template clone
  pitchList = checkList.concat(pitchList);
  shiftedTemplate['score-partwise'].part[0].measure[0].note = pitchList;

  return shiftedTemplate;
}

function mwMelodicShift(orig, shift) {
  let pitchList = [];

  const shiftedTemplate = JSON.parse(JSON.stringify(orig));

  // populate array of pitches (I am pretty sure if you attempt to clone with a prototype method or spread
  // you get cyclic obj values (perhaps from implicit call to JSON.stringify() ?))
  for (let measure of shiftedTemplate['score-partwise'].part[0].measure)
    for (let note of measure.note) pitchList.push(note.pitch);

  // rotate pitches <shift> places by slicing & concatenating
  pitchList = pitchList.splice(shift).concat(pitchList);

  // remove pitch(es) at the start of the list, update shifted template (same issue as above with protoype methods)
  for (let measure of shiftedTemplate['score-partwise'].part[0].measure)
    for (let n of measure.note) n.pitch = pitchList.shift();

  return shiftedTemplate;
}

// perform both shifts
function mwRhythmicMelodicShift(orig, shift) {
  let shifted = JSON.parse(JSON.stringify(orig));

  shifted = mwMelodicShift(shifted, shift);
  shifted = mwRhythmicShift(shifted, shift);
  return shifted;
}

function mergeMeasuresInScores(scores) {
  console.log('scores', scores);
  const result = JSON.parse(JSON.stringify(scores[0]));
  console.log(
    "result['score-partwise'].part[0].measure",
    result['score-partwise'].part[0].measure
  );
  for (let i = 1; i < scores.length; i++) {
    const measures = scores[i]['score-partwise'].part[0].measure;
    result['score-partwise'].part[0].measure =
      result['score-partwise'].part[0].measure.concat(measures);
  }
  console.log(
    "result['score-partwise'].part[0].measure",
    result['score-partwise'].part[0].measure
  );
  return result;
}

function elevenVariations(origStr) {
  const orig = JSON.parse(origStr);
  console.log('in elevenVariations(orig)', orig);
  console.log('!orig', !orig)
  console.log("!Object.hasOwn('score-partwise')");
  console.log(!Object.hasOwn(orig, 'score-partwise'));
  if (!orig || !Object.hasOwn(orig, 'score-partwise')) return null;
  const reversed = reverseFlatScore(orig);
  const rhymic1 = mwRhythmicShift(orig, 1);
  const rhymic2 = mwRhythmicShift(orig, 2);
  const rhymic3 = mwRhythmicShift(orig, 3);
  const melodic1 = mwMelodicShift(orig, 1);
  const melodic2 = mwMelodicShift(orig, 2);
  const melodic3 = mwMelodicShift(orig, 3);
  const rhythmicMelodic1 = mwRhythmicMelodicShift(orig, 1);
  const rhythmicMelodic2 = mwRhythmicMelodicShift(orig, 2);
  const rhythmicMelodic3 = mwRhythmicMelodicShift(orig, 3);
  const merged = mergeMeasuresInScores([
    orig,
    reversed,
    rhymic1,
    rhymic2,
    rhymic3,
    melodic1,
    melodic2,
    melodic3,
    rhythmicMelodic1,
    rhythmicMelodic2,
    rhythmicMelodic3,
  ]);
  return merged;
}

export {
  reverseFlatScore,
  mwRhythmicShift,
  mwMelodicShift,
  mwRhythmicMelodicShift,
  elevenVariations,
};
