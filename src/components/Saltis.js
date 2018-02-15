// @flow

import { Image, StatusBar, Text, View } from 'react-native';
import React, { Component } from 'react';

import cheerio from 'cheerio-without-node-native';

const backdrop = require('../img/backdrop.jpg');

export default class Saltis extends Component {
  state = {
    mealTexts: [
      {
        text: 'Loading meals...',
      },
    ],
  };

  componentWillMount() {
    fetch('http://www.saltimporten.com/', {
      method: 'GET',
    })
      .then(response => response.text())
      .then((body) => {
        const $ = cheerio.load(body);
        const meals = $('.meal');

        const mealTexts = [];

        meals.each((i, meal) => {
          const text = $(meal).text();
          const past = $(meal)
            .closest('li')
            .hasClass('past');
          const current = $(meal)
            .closest('li')
            .hasClass('current');
          const future = $(meal)
            .closest('li')
            .hasClass('future');
          const veg =
            $(meal)
              .closest('li')
              .find('.veg').length > 0;
          mealTexts.push({
            past,
            current,
            future,
            veg,
            text,
          });
        });
        this.setState({
          mealTexts,
        });
      })
      .catch(() => {
        this.setState({
          mealTexts: [
            {
              text: 'Sorry, something went wrong ;(',
            },
          ],
        });
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="rgba(255, 255, 255, 0)" />
        <Image style={styles.backdrop} source={backdrop} />
        {this.state.mealTexts.map((mealTextObject) => {
          const mealText = mealTextObject.text.split(' / ').join('/');
          return (
            <View key={mealText}>
              <Text numberOfLines={1} style={styles.mealText(mealTextObject)}>
                {mealText}
              </Text>
            </View>
          );
        })}
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    resizeMode: 'cover',
    width: null,
    height: null,
    opacity: 0.2,
  },
  mealText: mealTextObject => ({
    marginTop: mealTextObject.veg ? 15 : 0,
    color: mealTextObject.veg ? 'green' : 'black',
    opacity: mealTextObject.past ? 0.6 : 1,
    fontWeight: mealTextObject.current ? 'bold' : 'normal',
    backgroundColor: '#0000',
    fontFamily: 'System',
    fontSize: 20,
    letterSpacing: -1,
    marginBottom: 10,
  }),
};
