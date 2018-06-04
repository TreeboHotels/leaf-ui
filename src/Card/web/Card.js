import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import View from '../../View/web';
import theme from '../../theme';

const styles = {
  borderRadius(props) {
    if (props.shape === 'bluntEdged') {
      return props.theme.borderRadius;
    } else if (props.shape === 'sharpEdged') {
      return '0';
    } else if (props.shape === 'capsular') {
      return props.theme.px(10);
    } else if (props.shape === 'circular') {
      return '100%';
    }
    return '';
  },
};

const Card = styled(
  ({
    borderColor,
    backgroundColor,
    elevated,
    ...props
  }) => <View {...props} />,
)`
  border-width: 1px;
  border-style: ${(props) => props.borderStyle};
  border-radius: ${styles.borderRadius};
  border-color: ${(props) => props.borderColor ? props.theme.color[props.borderColor] : props.theme.color[props.backgroundColor]};
  background-color: ${(props) => props.theme.color[props.backgroundColor]};
  box-shadow: ${(props) => props.elevated ? '0 6px 16px 0 rgba(0, 0, 0, 0.16)' : ''};
`;

Card.propTypes = {
  borderColor: PropTypes.oneOf(Object.keys(theme.color)),
  backgroundColor: PropTypes.oneOf(Object.keys(theme.color)),
  elevated: PropTypes.bool,
  borderStyle: PropTypes.string,
  shape: PropTypes.oneOf(['bluntEdged', 'sharpEdged', 'capsular', 'circular']),
};

Card.defaultProps = {
  backgroundColor: 'white',
  borderStyle: 'solid',
  shape: 'bluntEdged',
};

export default Card;
