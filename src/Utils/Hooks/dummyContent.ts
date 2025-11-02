
import { LoremIpsum } from 'lorem-ipsum'

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 16,
    min: 1
  },
  wordsPerSentence: {
    max: 18,
    min: 2
  }
});

const dummyTitle = () => lorem.generateSentences(1);
const dummyDetails = () => lorem.generateParagraphs((Math.floor(Math.random() * 3) + 1))

export { dummyTitle, dummyDetails };
