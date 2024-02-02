import { hasBasePath } from "next/dist/server/router";

/* For 2/4, consider checking attributes:
 *    - beat-type
 *    - beats
 *    - Adagio beat list (iirc name)
 */

const template = JSON.parse(
  JSON.stringify({
    'score-partwise': {
      'part-list': {
        'score-part': [
          {
            'part-name': '',
            voiceMapping: { 0: [0] },
            staffMapping: [
              {
                mainVoiceIdx: 0,
                voices: [0],
                staffUuid: 'staffUuid',
              },
            ],
            voiceIdxToUuidMapping: {
              0: 'voiceUuid',
            },
            voiceUuidToIdxMapping: {
              voiceUuid: 0,
            },
            'part-abbreviation': '',
            'score-instrument': {
              'instrument-name': '',
              $id: 'P1-I1',
            },

            $id: 'P1',
            uuid: 'P1',
          },
        ],
      },
      part: [
        {
          measure: [
            {
              note: [],
              $number: '1',
              barline: {
                'bar-style': 'light-barline',
                noteBefore: -1,
              },
              attributes: [
                {
                  "divisions": 0,
                  time: { beats: '4', 'beat-type': '4' },
                  clef: {},
                  key: {},
                  'staff-details': { 'staff-lines': '5' },
                },
              ],
            },
          ],
          $id: 'P1',
          uuid: 'P1',
        },
      ],
    },
  })
);

/**
 * Takes a score and strips it of unnecessary properties, and rebuilds
 * according to spec (e.g., 2/4 -> 4/4, uuid's removed)
 * 
 * 
 * @param {*} orig the original score from flat
 * @param {*} key the key; could omit and do this in the function, but it's even uglier code
 * @param {*} clef the clef; could also omit
 * @param {*} notes The student's motive (notes only), could omit
 * @param {*} div The orig divisions, again, could omit
 * @returns 
 */
function correctScore(orig, key, clef, notes, div) {
  const origDupe = JSON.parse(JSON.stringify(orig));
  const result   = JSON.parse(JSON.stringify(template));
  const resultScorePart = result['score-partwise']['part-list']['score-part'][0];
  const origScorePart   = origDupe['score-partwise']['part-list']['score-part'][0];

  Object.keys(resultScorePart).forEach((key) => {
    if (Object.hasOwn(origScorePart, key) && key != "uuid") {
        resultScorePart[key] = origScorePart[key];
      }
  });

  result['score-partwise']['part'][0].measure[0].attributes[0].clef = clef;
  result['score-partwise']['part'][0].measure[0].attributes[0].key = key;
  result['score-partwise']['part'][0].measure[0].attributes[0].divisions = "" + div;   // I think necessary for rendering
  result['score-partwise']['part'][0].measure[0].note = [...notes];
  console.log("score immediately after correction", result);
  return result;
}

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
 * Still necessary despite template approach being taken
 * 
 * @param {*} measure measure to be corrected
 * @returns           corrected measure
 */
function correctMeasure(measure) {
  const   defaultDiv = 2;                                       // the default division, assuming shifts will be no less than 8th note
  let alteredMeasure = JSON.parse(JSON.stringify(measure));     // deep copy
  let  origDivisions = alteredMeasure.attributes[0].divisions;  // the original division
  let   beatDivision = defaultDiv / origDivisions;              // conversion factor for reconstruction
  console.log("beatDivision", beatDivision);
  console.log("origDivisions", alteredMeasure.attributes[0].divisions);
  console.log("inside correctMeasure measure", JSON.parse(JSON.stringify(alteredMeasure)));

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
  console.log(`For shift = ${shift}, orig measure: `, measure);
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
  result     = mwRhythmicShift(result, shift);
  result     = mwMelodicShift(result, shift);
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
  measures.forEach((measure) => {
    measure.note.forEach((note) => {
      note.duration = note.duration.toString();
      note.type = note.duration === "1" ? "eighth" : "quarter";
    });
    measure.attributes[0].divisions = measure.attributes[0].divisions.toString(); 
  });
  console.log("after merge modifications", measures);
  result['score-partwise'].part[0].measure = [...measures];
  result['score-partwise']['part-list']["score-part"].uuid = "variations";

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

  const key   = orig['score-partwise'].part[0].measure[0].attributes[0]['key'];
  const clef  = orig['score-partwise'].part[0].measure[0].attributes[0]['clef'];
  const divs  = orig['score-partwise'].part[0].measure[0].attributes[0].divisions;
  const notes = orig['score-partwise'].part[0].measure[0].note;
  const correctedScore   = correctScore(orig, key, clef, notes, divs);            // correct the whole score 
  const givenMeasure     = correctedScore['score-partwise'].part[0].measure[0];   // grab the motive...
  const correctedMeasure = correctMeasure(givenMeasure);                          // ...then correct it
  console.log("incoming score", orig);
  console.log("outgoing key", key);
  console.log("outgoing clef", clef);
  console.log("corrected score", correctedScore);
  console.log("given measure", givenMeasure);
  console.log("corrected measure", correctedMeasure);

  const measures = [];
  measures.addAll([
      correctedMeasure,
      mwRetrograde(JSON.parse(JSON.stringify(correctedMeasure))),   // why *another* deepcopy??
      mwRhythmicShift(correctedMeasure, 1),
      mwRhythmicShift(correctedMeasure, 2),
      mwRhythmicShift(correctedMeasure, 3),
      mwMelodicShift(correctedMeasure, 1),
      mwMelodicShift(correctedMeasure, 2),
      mwMelodicShift(correctedMeasure, 3),
      mwRhythmicMelodicShift(correctedMeasure, 1),
      mwRhythmicMelodicShift(correctedMeasure, 2),
      mwRhythmicMelodicShift(correctedMeasure, 3),
  ]);

  // ensure final measure has the correct type of barline
  measures[measures.length - 1].barline['bar-style'] = 'light-heavy';

  const  result = mwMergeVariations(correctedScore, measures);
  console.log("returning from createVariations", result);
  return result;
}

export {
  mwRetrograde,
  mwRhythmicShift,
  mwMelodicShift,
  mwRhythmicMelodicShift,
  mwCreateVariations,
};
