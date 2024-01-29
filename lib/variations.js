import { hasBasePath } from "next/dist/server/router";

/* For 2/4, consider checking attributes:
 *    - beat-type
 *    - beats
 *    - Adagio beat list (iirc name)
 */

/**
 * given a measure, generate that measure's retrograde
 * 
 * @param {*} orig the user-created measure
 * @returns        the measure in retrograde
 */
function mwRetrograde(orig) {
  const    result = JSON.parse(JSON.stringify(orig));
  const origNotes = orig.note;
  const  reversed = origNotes.reverse();

  /**
   * Updates notes' time positions following reversal
   * (this helper originally written by Dr. Michael Stewart)
   * @param {*} notes array of notes to reverse
   * @returns         array of notes in retrograde 
   * 
   * (flat doesn't seem to care about indexing of note array. 
   * Note position determined entirely by '$adagio-location', duration, 
   * and enclosing measure's 'divisions' property)
   */
  const setAdagioLocations = (notes) => {
    let timePos = 0;
    notes.forEach((note) => {
      note['$adagio-location'] = { timePos };
      timePos += parseInt(note.duration);
    });
    return notes;
  };

  result.note = setAdagioLocations(reversed);
  return result;
}

/**
 * rebuild given measure with attributes that are 
 * more in line for CPR's spec
 * 
 * @param {*} measure measure to be corrected
 * @returns           corrected measure
 */
function correctMeasure(measure) {
  const   defaultDiv = 2;                                       // the default division, assuming shifts will be no less than 8th note
  let alteredMeasure = JSON.parse(JSON.stringify(measure));     // deep copy
  let  origDivisions = alteredMeasure.attributes[0].divisions;  // the original division
  let beatDivision   = defaultDiv / origDivisions;              // conversion factor for reconstruction

  // check if reconstruction necessary
  let modify = origDivisions != defaultDiv && (alteredMeasure.attributes[0].divisions = defaultDiv);
  
  // only modify if necessary
  modify && (alteredMeasure.note.forEach((note) => {
    note['$adagio-location'].timePos = Math.floor(note['$adagio-location'].timePos * beatDivision);
    note.duration = Math.floor(note.duration * beatDivision);
  }));
  
  return alteredMeasure;
}

/**
 * Performs a rhythmic shift by eighths, wrapping shifted notes
 * back to measure start, coalescing notes that were split by 
 * the shift and now adjacent
 * 
 * @param {*} orig  the measure to shift
 * @param {*} shift number of eighths to shift by
 * @returns         shifted measure
 */
function mwRhythmicShift(orig, shift) {
  const  measure = JSON.parse(JSON.stringify(orig));  // deep copy
  const numNotes = orig.note.length;                  // original # of notes
  const adjShift = Math.ceil(shift / measure.attributes[0].divisions);    // adjusted shift (for splitting)
  const maxNotes = orig.attributes[0].time.beats * measure.attributes[0].divisions;   // max # notes possible (restricted to 8ths)
  console.log(`For shift = ${shift}, reconstructed single measure: `, measure);
  console.log("Number of notes in incoming measure: ", numNotes);
  console.log(`Passed Shift: ${shift}\nAdjusted Shift: ${adjShift}`);
  console.log("Maximum number of notes: ", maxNotes);

  let pitchList = [...measure.note]
  let checkList = pitchList.splice(numNotes - adjShift);

  const updateTimePos = (note) => {
    note['oPos'] = note['$adagio-location'].timePos;                // original position 
    note['$adagio-location'].timePos += shift;                      // perform the shift
    let timePos = note['uPos'] = note['$adagio-location'].timePos;  // updated position

    // timePos should be set according to whether note 
    // is candidate for splitting
    note['$adagio-location'].timePos = checkList.includes(note) ? 
      note.uPos - note.oPos - shift : timePos % maxNotes;

    return note;
  };
  pitchList = pitchList.map((n) => updateTimePos(n));
  checkList = checkList.map((n) => updateTimePos(n));

  // check the split candidates, and perform split if necessary.
  for (let note of checkList) {    
    if (note.duration > shift || note.uPos - maxNotes < 0) {
      let splitNote = JSON.parse(JSON.stringify(note));       // 1/2 of the note to split

      // perform the splitting
      splitNote['$adagio-location'].timePos = splitNote.uPos;
      splitNote.duration -= 1;
      note.duration -= 1;

      pitchList.push(splitNote);
    }
  }

  // construct the final list of notes and update the measure
  pitchList = checkList.concat(pitchList);
  measure.note = pitchList;
  return measure;
}
/**
 * Performs a melodic shift by eighths on a given measure,
 * i.e., circular permutation
 * Note: rhythms remain the same, only *pitches* are 
 *       shifted
 * 
 * @param {*} orig  the measure to shift
 * @param {*} shift amount of eighths to shift by
 * @returns         the shifted measure
 */
function mwMelodicShift(orig, shift) {
  const    result = JSON.parse(JSON.stringify(orig));
  const pitchList = [];

  for (let note of result.note) {
    pitchList.push(note.pitch);
  }
  const shiftList = pitchList.splice(shift).concat(pitchList);

  for (let note of result.note) {
    note.pitch = shiftList.shift();
  }

  return result;
}

/**
 * Performs both melodic and rhythmic shift by eighths
 * on a given measure. See documentation for mwRhythmicShift()
 * and mwMelodicShift() for individual function details
 * 
 * @param {*} orig  the measure to shift
 * @param {*} shift amount of eighths to shift by
 * @returns         the shifted measure
 */
function mwRhythmicMelodicShift(orig, shift) {
  let result = JSON.parse(JSON.stringify(orig));
  result = mwRhythmicShift(result, shift);
  result = mwMelodicShift(result, shift);
  return result;
}

/**
 * Prototype helper to make generating merged score
 * cleaner
 * 
 * @param {*} elements array of elements to add to this array
 */
Array.prototype.addAll = function(elements) {
  const thisArray = this;
  elements.forEach((e) => {
    thisArray.push(e);
  })
}

/**
 * A cleaner function to merge all the procedurally
 * generated variations
 * 
 * @param {*} orig     the original ***score JSON*** (w/ user-created measure)
 * @param {*} measures an iterable of measures 
 * @returns            a single score with 11 variations built from
 *                     a user-created motive
 */
function mwMergeVariations(orig, measures) {
  const result = JSON.parse(JSON.stringify(orig));
  result['score-partwise'].part[0].measure = [...measures];
  return result;
}

/**
 * Takes a user-created motive and generates 10
 * variations:
 *  - retrograde     (1)
 *  - rhythmic shift (3)
 *  - melodic shift  (3)
 *  - both r + m     (3)
 * Then builds one score with all 10 variations + the user's
 * original motive
 * 
 * @param {*} origStr String repr of the user-created motive
 * @returns           An 11 measure score with original motive 
 *                    and 10 procedurally generated variations
 *                    on that motive
 */
function mwCreateVariations(origStr) {
  const orig = JSON.parse(origStr.slice());

  if (!orig || !Object.hasOwn(orig, 'score-partwise'))
    return null

  const origMeasure = orig['score-partwise'].part[0].measure[0];
  const corrected = correctMeasure(origMeasure);

  const measures = [];
  measures.addAll([
      corrected,
      mwRetrograde(JSON.parse(JSON.stringify(corrected))),   // why *another* deepcopy??
      mwRhythmicShift(corrected, 1),
      mwRhythmicShift(corrected, 2),
      mwRhythmicShift(corrected, 3),
      mwMelodicShift(corrected, 1),
      mwMelodicShift(corrected, 2),
      mwMelodicShift(corrected, 3),
      mwRhythmicMelodicShift(corrected, 1),
      mwRhythmicMelodicShift(corrected, 2),
      mwRhythmicMelodicShift(corrected, 3),
    ]);

    const  result = mwMergeVariations(orig, measures);
    return result;
}

export {
  mwRetrograde,
  mwRhythmicShift,
  mwMelodicShift,
  mwRhythmicMelodicShift,
  mwCreateVariations,
};
