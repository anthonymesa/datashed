
import { LoremIpsum } from 'lorem-ipsum'

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 32,
    min: 8
  },
  wordsPerSentence: {
    max: 18,
    min: 2
  }
});

const dummyTitle = () => lorem.generateSentences(1);
const dummyDetails = () => lorem.generateSentences(Math.random() * 5)

export { dummyTitle, dummyDetails };
