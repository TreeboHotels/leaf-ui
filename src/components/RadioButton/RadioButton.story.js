import React from 'react';
import { storiesOf } from '@storybook/react';
import Aux from '../Aux';
import RadioButton from './RadioButton';

storiesOf('RadioButton', module)
  .add('simple', () => (
    <Aux>
      <RadioButton
        name="leafColor"
        label="Green"
        value="green"
      />
      <RadioButton
        name="leafColor"
        label="Brown"
        value="brown"
      />
    </Aux>
  ))
  .add('disabled', () => (
    <Aux>
      <RadioButton
        name="leafColor"
        label="Green"
        value="green"
        disabled
        defaultChecked
      />
      <RadioButton
        name="leafColor"
        label="Brown"
        value="brown"
        disabled
      />
    </Aux>
  ))
  .add('with error', () => (
    <RadioButton
      name="leafColor"
      label="Brown"
      value="brown"
      error="no they're not"
      defaultChecked
    />
  ));
