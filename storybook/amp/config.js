import React from 'react';
import { ThemeProvider } from 'styled-components';
import { addDecorator, configure } from '@storybook/react';
import { withOptions } from '@storybook/addon-options';
import { withKnobs } from '@storybook/addon-knobs';
import BaseStyle from '../../src/Style/web/BaseStyle';
import theme from '../../src/theme/amp';

withOptions({
  name: 'Leaf-UI',
  url: 'https://github.com/treebohotels/leaf-ui',
  addonPanelInRight: true,
});

addDecorator(withKnobs);

addDecorator((story) =>
  (
    <ThemeProvider theme={theme}>
      <BaseStyle />
      {story()}
    </ThemeProvider>
  ));

configure(() => {
  const req = require.context('../../src', true, /\/amp\/.*\.story.js$/);
  req.keys().forEach((filename) => req(filename));
}, module);
