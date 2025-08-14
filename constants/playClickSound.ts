import { Audio } from 'expo-av';

const sounds = {
  click: require('../assets/sfx/click4.wav'),
  confirm: require('../assets/sfx/confirm.wav'),
  correct: require('../assets/sfx/correct2.wav'),
  wrong: require('../assets/sfx/wrong.wav'),
  confetti: require('../assets/sfx/celeb.mp3'),
  flip: require('../assets/sfx/flip.mp3')
};

export const playSound = async (key: keyof typeof sounds) => {
  try {
    const { sound } = await Audio.Sound.createAsync(sounds[key]);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync();
      }
    });
  } catch (e) {
    console.warn(`Sound error (${key})`, e);
  }
};
