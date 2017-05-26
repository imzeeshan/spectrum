// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import { closeGallery } from '../../actions/gallery';
import {
  Overlay,
  ActiveImage,
  Minigallery,
  MiniImg,
  MiniContainer,
  CloseButton,
  GalleryWrapper,
} from './style';

class Browser extends Component {
  state: {
    images: Array<Object>,
    activeMessageId: string,
    index: number,
  };

  constructor(props) {
    super(props);

    let index;
    props.data.messages.map((message, i) => {
      if (message.id === props.activeMessageId) {
        index = i;
      }
    });

    this.state = {
      images: props.data.messages,
      activeMessageId: props.activeMessageId,
      index,
    };
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  closeGallery = () => {
    this.props.dispatch(closeGallery());
  };

  handleKeyPress = e => {
    const { images, index } = this.state;
    // if no media, skip on outta here
    if (!images) return;

    let length = images.length;

    // if person taps esc, close the dialog
    if (e.keyCode === 27) {
      this.closeGallery();
    }

    // left arrow key
    if (e.keyCode === 37) {
      this.previousImage();
    }

    if (e.keyCode === 39) {
      this.nextImage();
    }
  };

  previousImage = () => {
    let { index, images } = this.state;
    if (index === 0) {
      index = images.length - 1;
      this.setState({
        index,
      });
    } else {
      index = index - 1;

      this.setState({
        index,
      });
    }
  };

  nextImage = () => {
    let { index, images } = this.state;
    if (index === images.length - 1) {
      index = 0;
      this.setState({
        index,
      });
    } else {
      index = index + 1;

      this.setState({
        index,
      });
    }
  };

  setCount = i => {
    this.setState({
      index: i,
    });
  };

  render() {
    const { images, index } = this.state;
    return (
      <GalleryWrapper>
        <CloseButton onClick={this.closeGallery}>✕</CloseButton>
        <Overlay onClick={this.closeGallery} onKeyDown={this.handleKeyPress} />
        <ActiveImage
          onClick={this.nextImage}
          src={images[index].content.body}
        />
        <Minigallery>
          <MiniContainer>
            {images.map((image, i) => {
              return (
                <MiniImg
                  src={image.content.body}
                  key={i}
                  onClick={() => this.setCount(i)}
                  active={i === index}
                />
              );
            })}
          </MiniContainer>
        </Minigallery>
      </GalleryWrapper>
    );
  }
}

export default connect()(Browser);