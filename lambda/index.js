// This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
// Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
// session persistence, api calls, and more.
const Alexa = require('ask-sdk-core');
let data = require('./data')

const MAX_QUESTION_COUNT = 5;

const QuizIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'QuizIntent';
    },
    handle(handlerInput) {
        let currentQuizCount = 0
        let question = data.questions[currentQuizCount];
        let attrs = handlerInput.attributesManager.getSessionAttributes();
        attrs.gameState = 'STARTED';
        attrs.quizCount = currentQuizCount;
        
        let scores = {}
        data.destinations.forEach(function(destination){
            scores[destination] = 0;
        });
        attrs.scores = scores
        
        var speechText = `Ok. Let's start it. ${question}`;
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(question)
            .getResponse();
    }
};

function getTopDesitnation(destinationScores) {
    var topDestination = '';
    var topScore = -1;
    destinationScores.forEach(function(destination, score, map) {
        if (score > topScore) {
            topDestination = destination;
        }
    });
    
    return topDestination;
}

const AnswerIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && ['AMAZON.YesIntent', 'AMAZON.NoIntent'].includes( handlerInput.requestEnvelope.request.intent.name);
    },
    handle(handlerInput) {
        let attrs = handlerInput.attributesManager.getSessionAttributes();
        let yesDestinations = data.questionDestinationMatch[attrs.quizCount];
        if (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.YesIntent'){
            yesDestinations.forEach(function(destination){
                attrs.scores[destination] += 1;
            });
        } else {
            data.destinations.forEach(function(destination) {
               if(!yesDestinations.includes(destination)) {
                   attrs.scores[destination] += 1;
               }
            });
        }
        
        attrs.quizCount += 1;
        
        if (attrs.quizCount >= MAX_QUESTION_COUNT) {
            let topDestination = getTopDesitnation(attrs.scores);
            let speechText = `Based on my calculation. You'll enjoy ${topDestination} for your next vacation. Thanks for playing Qoo Quiz.`;
            return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
        } else {
            let question = data.questions[attrs.quizCount];
            let speechText = `Next question. ${question}`;
            
            return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(question)
            .getResponse();
        }
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Welcome to Qoo Quiz. I can find the best vacation destination for you. To start it, just say play game.';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speechText = 'Hello World!';
        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}. Do you forget to put the intent handler in Alexa Skill Builders?`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// This handler acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        QuizIntentHandler,
        AnswerIntentHandler,
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
