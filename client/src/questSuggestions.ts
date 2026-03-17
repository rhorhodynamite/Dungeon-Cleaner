// Pre-generated quest titles in mock-archaic RPG style, keyed by skill name (lowercase).
// Falls back to GENERIC when no match is found.

const SUGGESTIONS: Record<string, string[]> = {
  cleaning: [
    "Banish the foul dust-demons from thine chamber floor forthwith",
    "Scour the cursed cauldron until thy reflection stares back in shame",
    "Vanquish the grease-wraith that hath taken root upon the stovetop",
    "Purge the unholy clutter from the realm of the living room",
    "Smite the mildew-beast lurking in yonder bathroom grout",
    "Thou shalt empty the vessel of refuse before it overtaketh the land",
    "Sweep the ancient crumbs from beneath the couch of forgotten meals",
    "Polish the windows so that light may once more pierce this dark fortress",
    "Defeat the towering pile of dishes ere the sun claimeth the horizon",
    "Rid thine abode of the cobwebs that the eight-legged ones hath woven",
  ],

  laundry: [
    "Thou shalt cleanse the reeking garments piled in yonder basket",
    "Retrieve thine vestments from the iron drum of spinning and folding",
    "Smite the stain upon thy tunic with the sacred stain-removing potion",
    "Carry the cloth burden down to the washing chamber and return victorious",
    "Sort the darks from the lights as prophecy hath foretold",
    "Iron the wrinkled robes lest thou appear as a vagabond before thine peers",
    "Hang the damp linens upon the line ere mildew claimeth them",
    "Match the missing sock twins, scattered across the realm like lost relics",
    "Fold the tower of clean laundry that mocketh thee from the chair",
    "Return the borrowed garments to their rightful drawer-dungeon",
  ],

  fitness: [
    "Go forth and pump yonder Iron so thee mightst one day charge into the fray",
    "Complete thine sacred laps around the realm before the cock doth crow",
    "Lift the heavy things and set them down again, repeatedly, for glory",
    "Run until thine lungs cry mercy, then run a little more for honour",
    "Do the press-up ritual twenty times in service of thine future battle-self",
    "Conquer the great staircase of cardio and return with thine pulse victorious",
    "Stretch thy sinews at dawn lest they betray thee in the heat of combat",
    "Mount the stationary steed and pedal toward imaginary glory",
    "Perform the ancient plank pose and hold it until thine soul leaves thy body",
    "Vanquish one hundred squats in the name of thine posterior glory",
  ],

  cooking: [
    "Prepare ye the sacred evening feast lest hunger claim thine household",
    "Transmute the raw ingredients into something thy family shall actually consume",
    "Conquer the cursed recipe that hath defeated thee thrice before",
    "Boil the ancient grains until they surrender into edible submission",
    "Roast the beast at the appointed hour or face the wrath of the hungry",
    "Bake the bread of sustenance that thy ancestors once wielded as a weapon",
    "Chop the vegetables of virtue into pieces of righteous nourishment",
    "Summon a meal from the forgotten provisions lurking at the back of the larder",
    "Craft the soup of restoration to banish the cold that hath beset the kingdom",
    "Meal-prep for the forthcoming week like the organised hero thou art",
  ],

  running: [
    "Carry thy meat-vessel around the block at haste for honour and sweat",
    "Chase the horizon until thine calves weep and thine spirit soars",
    "Run five kilometres through the realm as training for the great escape",
    "Complete the morning pilgrimage around the park without stopping to walk",
    "Race against thine former self's time and smite that record asunder",
    "Venture forth at dawn and return before thy household knoweth thou wert gone",
    "Sprint up yonder hill until thine thighs beg for divine intervention",
    "Log the sacred miles in the book of distances, lest they be forgotten",
  ],

  gym: [
    "Go forth and pump yonder Iron so thee mightst one day charge into the fray",
    "Attend the iron temple and perform the rituals thy trainer hath prescribed",
    "Do battle with the weights until they acknowledge thy supremacy",
    "Conquer leg day though every fibre of thine being cryeth out against it",
    "Secure a bench in the iron hall and do not relinquish it for one hour",
    "Complete the full circuit of machines and emerge transformed, if sore",
    "Challenge the heaviest kettlebell and return with a tale to tell",
  ],

  yoga: [
    "Twist thine body into the sacred pretzel formation and breathe through the shame",
    "Hold the warrior pose until thine legs forgive thee for all past wrongs",
    "Attend the morning sun salutation and do not fall asleep in child's pose",
    "Achieve the pigeon pose and confront the feelings it bringeth forth",
    "Flow through the sequence with grace, or at least without toppling",
    "Seek inner peace for sixty minutes, which is to say — do not check thy phone",
  ],

  meditation: [
    "Sit in silence for ten minutes and do not think about the thing",
    "Still thy monkey-mind with the ancient breath-counting ritual",
    "Complete the morning stillness practice before the chaos claimeth the day",
    "Commune with the void for fifteen minutes and emerge slightly less frantic",
    "Do the guided meditation thou hast been putting off since the dark winter",
  ],

  reading: [
    "Consume thirty pages of the tome that hath sat reproachfully on thine nightstand",
    "Make progress in the book thy friend recommended eleven months ago",
    "Read one chapter before sleep rather than scrolling into the abyss",
    "Finish the book thou hast been reading since the last age of the world",
    "Venture into the library and return with knowledge and maybe a fine",
  ],

  studying: [
    "Open the textbook and gaze upon it with thine actual eyes for one full hour",
    "Complete the practice problems ere the exam claimeth thine GPA",
    "Review thine notes from the lecture thou barely survived last Tuesday",
    "Write the essay that lurketh at the back of thine mind like a shadow-wraith",
    "Learn the things before thou art tested on the things",
    "Attend the study session and participate rather than drawing in thy margin",
  ],

  shopping: [
    "Venture forth to the great market-hall and return with victuals for the week",
    "Compile the sacred scroll of provisions and acquire them without deviation",
    "Slay the empty fridge before it demoralises the household entirely",
    "Purchase the household supplies that have run out for the third consecutive time",
    "Navigate the crowded bazaar and emerge with everything on the list and nothing else",
  ],

  gardening: [
    "Tame the wild and unruly green realm that surrounds thine fortress",
    "Wage war upon the weeds that mocketh thee from the flowerbed",
    "Water the plants thou hast been neglecting since the last full moon",
    "Mow the great grass plains before the neighbours form a committee about it",
    "Plant the seeds of future harvest with thine own two earth-stained hands",
    "Rescue the withered herbs from the pot of shame on the windowsill",
  ],

  walking: [
    "March ten thousand steps in service of thine daily movement quota",
    "Take the long way home as thine ancestors once did, because they had no choice",
    "Walk to the destination that Google saith is only twelve minutes away",
    "Complete the evening constitutional and clear the fog from thine mind",
    "Stride through the park with purpose as though thou art late for battle",
  ],

  sleep: [
    "Retire to thy sleeping chamber before midnight for once in thine life",
    "Prepare thy body for slumber with the sacred screen-free ritual",
    "Achieve eight hours of rest as the healers hath prescribed since time immemorial",
    "Put the phone down and let the darkness take thee at a reasonable hour",
  ],

  work: [
    "Complete the dreaded task that hath lingered on thy list like an ancient curse",
    "Slay the inbox dragon before it multiplieth beyond all reckoning",
    "Finish the report that thy overlord expecteth before the moon is high",
    "Attend the meeting and pretend thou hast not already read the agenda",
    "Clear the backlog of doom ere it becometh a backlog of legend",
    "Deliver the thing that was due yesterday without making it anyone else's problem",
  ],

  coding: [
    "Debug the ancient prophecy of errors until the tests doth pass",
    "Vanquish the todo comment that hath lurked in the codebase since the old times",
    "Write the tests thou promised thyself thou wouldst write last sprint",
    "Refactor the cursed function before it claimeth another developer's sanity",
    "Ship the feature before the sprint endeth and the product owner weepeth",
    "Read the documentation like the responsible adventurer thou claimest to be",
  ],
};

// Fallback list for custom skills not in the map
const GENERIC: string[] = [
  "Thou shalt complete this noble task and speak of it proudly to thine descendants",
  "Venture forth and accomplish the deed, however unglamorous it might appear",
  "Do the thing that must be done, for the realm dependeth upon it",
  "Complete this quest and mark it done with the satisfaction of the righteous",
  "Tackle the task before thee with the courage of a thousand mediocre warriors",
  "Get it done, noble adventurer, for the to-do list waiteth for no one",
  "Embark upon this humble quest, knowing glory cometh in many mundane forms",
  "Heed the call of duty and complete this undertaking without further delay",
  "Steel thine resolve, gird thine loins, and just do the thing",
  "Begin the task immediately rather than adding it to a second list",
];

export function getQuestSuggestion(skillName: string): string {
  const key = skillName.toLowerCase().trim();

  // Try exact match first, then partial match
  const list =
    SUGGESTIONS[key] ??
    Object.entries(SUGGESTIONS).find(([k]) => key.includes(k) || k.includes(key))?.[1] ??
    GENERIC;

  return list[Math.floor(Math.random() * list.length)];
}
