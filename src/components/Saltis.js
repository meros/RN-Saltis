// @flow

import { Image, StatusBar, Text, View } from 'react-native';
import React, { Component } from 'react';

import cheerio from 'cheerio-without-node-native';

export default class Saltis extends Component {
  state = {
    mealTexts: [{
      text: 'Loading meals...'
    }]
  }

  componentWillMount() {
    fetch('http://www.saltimporten.com/', {
      method: "GET",
    }).then((response) => {
      return response.text();
    }).then((body) => {
      let $ = cheerio.load(body);
      let meals = $('.meal');

      let mealTexts = [];

      meals.each((i, meal) => {
        let text = $(meal).text();
        let past = ($(meal).closest('li').hasClass('past'));
        let current = ($(meal).closest('li').hasClass('current'));
        let future = ($(meal).closest('li').hasClass('future'));
        let veg = ($(meal).closest('li').find('.veg').length > 0);
        mealTexts.push({
          past, current, future, veg, text
        });
      });
      this.setState({
        mealTexts: mealTexts
      });
    }).catch((error) =>{
      console.log(error);
      this.setState({
        mealTexts: [{
          text: 'Sorry, something went wrong ;('
        }]
      });
    });
  }

  render() {
    return (
      <View
        style={styles.container}>
        <StatusBar
          translucent backgroundColor="rgba(255, 255, 255, 0)"/>
        <Image
          style={styles.backdrop}
          source={require('../img/backdrop.jpg')}>
        </Image>
        {
          this.state.mealTexts.map((mealTextObject, i) => {
            let mealText = mealTextObject.text.split(' / ').join('/');
            return (
              <View
                key={i}>
                <Text
                  numberOfLines={1}
                  style={styles.mealText(mealTextObject)}>
                  { mealText }
                </Text>
              </View>
            );
          })
        }
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
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
  mealText: (mealTextObject) => {
    return {
      marginTop: (mealTextObject.veg?15:0),
      color: (mealTextObject.veg?'green':'black'),
      opacity: (mealTextObject.past?0.6:1),
      fontWeight: (mealTextObject.current?'bold':'normal'),
      backgroundColor: '#0000',
      fontFamily: 'System',
      fontSize: 20,
      letterSpacing: -1,
      marginBottom: 10,
    };
  },
};
