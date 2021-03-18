import {shuffle} from 'lodash';
import React, {Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import RandomNumber from './RandomNumber';

export class Game extends Component {
  state = {
    selectedNumbersIndex: [],
    remainingSeconds: this.props.initialSeconds,
  };

  randomNumbers = Array.from({length: this.props.randomNumberCount}).map(() => {
    return 1 + Math.floor(10 * Math.random());
  });

  shuffledRandomNumbers = shuffle(this.randomNumbers);

  target = this.randomNumbers
    .slice(0, this.props.randomNumberCount - 2)
    .reduce((acc, curr) => acc + curr, 0);

  isNumberSelected = numberIndex => {
    return this.state.selectedNumbersIndex.indexOf(numberIndex) >= 0;
  };

  selectNumber = numberIndex => {
    this.setState(prevState => {
      return {
        selectedNumbersIndex: [...prevState.selectedNumbersIndex, numberIndex],
      };
    });
  };

  calcGameStatus = state => {
    const sumSelected = state.selectedNumbersIndex.reduce(
      (acc, val) => acc + this.shuffledRandomNumbers[val],
      0,
    );

    let status = null;

    if (sumSelected > this.target || state.remainingSeconds === 0) {
      status = 'LOST';
    } else if (sumSelected < this.target) {
      status = 'PLAYING';
    } else if (sumSelected === this.target) {
      status = 'WON';
    }

    if (status !== 'PLAYING') {
      clearInterval(this.intervalId);
    }

    return status;
  };

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState(
        prevState => {
          return {
            remainingSeconds: prevState.remainingSeconds - 1,
          };
        },
        () => {
          if (this.state.remainingSeconds === 0) {
            clearInterval(this.intervalId);
          }
        },
      );
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  render() {
    this.gameStatus = this.calcGameStatus(this.state);
    return (
      <View style={styles.container}>
        <Text style={[styles.target, styles[`STATUS_${this.gameStatus}`]]}>
          {this.target}{' '}
        </Text>
        <View style={styles.randomContainer}>
          {this.shuffledRandomNumbers.map((number, index) => {
            return (
              <RandomNumber
                key={index}
                onPress={this.selectNumber}
                id={index}
                number={number}
                isDisabled={
                  this.isNumberSelected(index) || this.gameStatus !== 'PLAYING'
                }
              />
            );
          })}
        </View>
        {this.gameStatus !== 'PLAYING' ? (
          <Button
            title="Play Again"
            onPress={() => {
              this.props.onPlayAgain();
            }}
          />
        ) : null}

        <Text>Remaining: {this.state.remainingSeconds} secs...</Text>
        <Text>{this.gameStatus}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ddd',
  },
  target: {
    fontSize: 50,
    backgroundColor: '#aaa',
    margin: 50,
    textAlign: 'center',
    paddingTop: 30,
    color: 'white',
  },
  randomContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  STATUS_PLAYING: {
    backgroundColor: '#bbb',
  },
  STATUS_WON: {
    backgroundColor: 'green',
  },
  STATUS_LOST: {
    backgroundColor: 'red',
  },
});

export default Game;
