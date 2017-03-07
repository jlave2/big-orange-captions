# HUGE ORANGE CAPTIONS
Use machine learning to generate rambling nonsense about arbitrary pictures.

<p align="center">
  <img src='http://i.imgur.com/b2ANkbb.png' />
</p>

## Behind the scenes
Huge Orange Captions is based on two pre-existing deep-learning libraries:
* Karpathy's [neuraltalk2](https://github.com/karpathy/neuraltalk2), a combination [CNN-RNN](http://datascience.stackexchange.com/a/11621) which has been trained on the [MSCOCO](http://mscoco.org/) image set
* [word-rnn-tensorflow](https://github.com/hunkim/word-rnn-tensorflow), an [LSTM-RNN](http://colah.github.io/posts/2015-08-Understanding-LSTMs/) originally written in Lua by Lars Eidnes but which has been ported to Tensorflow

Also used was
* [docker-neuraltalk2](https://github.com/SaMnCo/docker-neuraltalk2), a Docker container which simplifies obtaining all the dependencies necessary for neuraltalk2

## You can host it!
Ensure you have [docker](https://www.docker.com/) installed, then run
```
docker pull jlave2/huge-orange-captions
docker run -dit -p 4000:4000 jlave2/huge-orange-captions
docker exec -it jlave2/huge-orange-captions 'cd root/huge-orange-captions && node index.js'
```
