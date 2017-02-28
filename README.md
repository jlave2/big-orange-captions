# HUGE ORANGE CAPTIONS
Use machine learning to generate rambling nonsense about arbitrary pictures.

## Behind the scenes
Huge Orange Captions is based on two pre-existing deep-learning libraries:
* Karpathy's [neuraltalk2](https://github.com/karpathy/neuraltalk2), a combination CNN-RNN which has been trained on the [MSCOCO](http://mscoco.org/) image set
* [word-rnn-tensorflow](https://github.com/hunkim/word-rnn-tensorflow), an LSTM-RNN originally written in Lua by Lars Eidnes but which has been ported to Tensorflow

Also used was
* [docker-neuraltalk2](https://github.com/SaMnCo/docker-neuraltalk2), a Docker container which simplifies obtaining all the dependencies necessary for neuraltalk2

## You can host it!
