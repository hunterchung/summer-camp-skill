module.exports.questions = [
    "Do you like hot spring?",
    "Do you want to drive?",
    "Is air quality important to you?",
    "Do you want to have street food?",
    "Do you want to go to America?",
    "Do you like museum?",
    "Do you want to have Asian food?",
    "Do you like scenic train ride?",
    "Do you want to visit top university?",
    "Do you wish to encounter movie stars?",
    "Do you want to explore languages other than Chinese and English?"
];

module.exports.destinations = [
    "Budapest",
    "Mexico City",
    "Hakone",
    "Taipei",
    "Heidelberg",
    "Los Angeles"
]

module.exports.question_destination_match = [
    ["Budapest", "Hakone", "Taipei"],
    ["Mexico City", "Hakone", "Heidelberg", "Los Angeles"],
    ["Budapest", "Hakone", "Heidelberg"],
    ["Mexico City", "Taipei"],
    ["Mexico City", "Los Angeles"],
    ["Mexico City", "Taipei", "Los Angeles"],
    ["Hakone", "Taipei"],
    ["Hakone"],
    ["Taipei", "Heidelberg", "Los Angeles"],
    ["Taipei", "Los Angeles"],
    ["Heidelberg", "Los Angeles"]
];

// module.exports.questions = questions