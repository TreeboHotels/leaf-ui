import React from 'react';
import PropTypes from 'prop-types';
import { withTheme } from 'styled-components';
import dateFnsIsBefore from 'date-fns/is_before';
import dateFnsIsAfter from 'date-fns/is_after';
import dateFnsFormat from 'date-fns/format';
import dateFnsIsSameDay from 'date-fns/is_same_day';
import DayPicker from 'react-day-picker';
import Flex from '../../Flex/web';
import Space from '../../Space/web';
import Position from '../../Position/web';
import View from '../../View/web';
import TextInput from '../../TextInput/web';
import DatePickerNavbar from '../../DatePickerInput/web/DatePickerNavbar';
import injectDatePickerStyles from '../../DatePickerInput/web/injectDatePickerStyles';

class DateRangePickerInput extends React.Component {
  state = {
    isOpen: false,
    from: this.props.defaultValue.from,
    to: this.props.defaultValue.to,
    enteredTo: this.props.defaultValue.to,
  };

  datePickerHasFocus = false

  timeout = {}

  componentWillMount = () => {
    const { theme } = this.props;
    injectDatePickerStyles(theme);
  }

  componentDidMount() {
    const { from, to } = this.state;
    const { name } = this.props;
    const { formik } = this.context;
    if (formik && name.from && name.to) {
      formik.setFieldValue(name.from, from);
      formik.setFieldValue(name.to, to);
    }
  }

  onFromInputFocus = () => {
    setTimeout(() => {
      this.setState({ isOpen: 'from' });
    }, 1);
  }

  onToInputFocus = () => {
    const { from } = this.state;
    if (!from) {
      this.fromInputRef.focus();
    } else {
      setTimeout(() => {
        this.setState({ isOpen: 'to' });
      }, 1);
    }
  }

  onInputBlur = () => {
    this.timeout.inputBlur = setTimeout(() => {
      if (!this.datePickerHasFocus) {
        this.setState({ isOpen: false });
      }
    }, 1);
  }

  onDatePickerFocus = (e) => {
    const { isOpen } = this.state;
    e.preventDefault();
    this.datePickerHasFocus = true;
    if (isOpen === 'from') {
      this.fromInputRef.focus();
    } else if (isOpen === 'to') {
      this.toInputRef.focus();
    }
  }

  onDatePickerBlur = () => {
    this.timeout.datePickerBlur = setTimeout(() => {
      this.datePickerHasFocus = false;
    }, 1);
  }

  onDayClick = (day, modifiers) => {
    const { isOpen, from, to } = this.state;
    const {
      name,
      onDateRangeChange,
      onFromDateChange,
      onToDateChange,
    } = this.props;
    const { formik } = this.context;

    if (
      modifiers.disabled
      || dateFnsIsSameDay(day, from)
      || dateFnsIsSameDay(day, to)
    ) {
      return;
    }

    if (isOpen === 'from') {
      if (dateFnsIsAfter(day, to)) {
        this.setState({
          from: day,
          to: undefined,
          enteredTo: undefined,
        }, () => {
          if (formik && name.from && name.to) {
            formik.setFieldValue(name.from, day);
            formik.setFieldValue(name.to, '');
          }
          onFromDateChange(day, modifiers);
          this.toInputRef.focus();
        });
      } else {
        this.setState({
          isOpen: !to ? 'to' : false,
          from: day,
        }, () => {
          if (formik && name.from && name.to) {
            formik.setFieldValue(name.from, day);
          }
          if (!to) {
            onFromDateChange(day, modifiers);
            this.toInputRef.focus();
          } else {
            onFromDateChange(day, modifiers);
            onDateRangeChange({ from: day, to }, modifiers);
            this.fromInputRef.blur();
          }
        });
      }
    } else if (isOpen === 'to') {
      if (dateFnsIsBefore(day, from)) {
        this.setState({
          from: day,
          to: undefined,
          enteredTo: undefined,
        }, () => {
          if (formik && name.from && name.to) {
            formik.setFieldValue(name.from, day);
            formik.setFieldValue(name.to, '');
          }
          onFromDateChange(day, modifiers);
        });
      } else {
        this.setState({
          isOpen: false,
          to: day,
          enteredTo: day,
        }, () => {
          if (formik && name.from && name.to) {
            formik.setFieldValue(name.to, day);
          }
          onToDateChange(day, modifiers);
          onDateRangeChange({ from, to: day }, modifiers);
          this.toInputRef.blur();
        });
      }
    }
  }

  onDayMouseEnter = (day) => {
    const { to } = this.state;
    if (!to) {
      this.setState({ enteredTo: day });
    }
  }

  formatDayForInput = (day) => {
    const { format } = this.props;
    if (day) {
      return dateFnsFormat(day, format);
    }
    return '';
  }

  storeToInputRef = (ref) => {
    this.toInputRef = ref;
  }

  storeFromInputRef = (ref) => {
    this.fromInputRef = ref;
  }

  render() {
    const {
      isOpen,
      from,
      to,
      enteredTo,
    } = this.state;

    const {
      className,
      label,
      placeholder,
      disabled,
      format,
      fromMonth,
      toMonth,
      modifiers,
      renderDay,
      disabledDays,
    } = this.props;

    return (
      <View className={className}>
        <Flex flexDirection="row">
          <View>
            <Space margin={[0, 2, 0, 0]}>
              <TextInput
                inputRef={this.storeFromInputRef}
                label={label.from}
                value={this.formatDayForInput(from)}
                placeholder={placeholder.from || format}
                disabled={disabled.from}
                onFocus={this.onFromInputFocus}
                onBlur={this.onInputBlur}
                autoComplete="off"
              />
            </Space>
            <TextInput
              inputRef={this.storeToInputRef}
              label={label.to}
              value={this.formatDayForInput(to)}
              placeholder={placeholder.to || format}
              disabled={disabled.to}
              onFocus={this.onToInputFocus}
              onBlur={this.onInputBlur}
              autoComplete="off"
            />
          </View>
        </Flex>
        {
          isOpen ? (
            <Position position="relative">
              <View>
                <Position
                  position="absolute"
                  top={0}
                  left={0}
                >
                  <View
                    tabIndex={0}
                    onFocus={this.onDatePickerFocus}
                    onBlur={this.onDatePickerBlur}
                  >
                    <DayPicker
                      numberOfMonths={2}
                      fromMonth={fromMonth}
                      toMonth={toMonth}
                      month={from}
                      selectedDays={[from, { from, to: enteredTo }]}
                      disabledDays={disabledDays}
                      modifiers={{
                        start: [from],
                        end: [enteredTo],
                        ...modifiers,
                      }}
                      navbarElement={<DatePickerNavbar />}
                      captionElement={() => null}
                      renderDay={renderDay}
                      onDayClick={this.onDayClick}
                      onDayMouseEnter={this.onDayMouseEnter}
                    />
                  </View>
                </Position>
              </View>
            </Position>
          ) : null
        }
      </View>
    );
  }
}

DateRangePickerInput.propTypes = {
  className: PropTypes.string,
  name: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
  }),
  label: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
  }),
  placeholder: PropTypes.shape({
    from: PropTypes.string,
    to: PropTypes.string,
  }),
  defaultValue: PropTypes.shape({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
  }),
  disabled: PropTypes.shape({
    from: PropTypes.bool,
    to: PropTypes.bool,
  }),
  format: PropTypes.string,
  fromMonth: PropTypes.instanceOf(Date),
  toMonth: PropTypes.instanceOf(Date),
  modifiers: PropTypes.object,
  renderDay: PropTypes.func,
  onDateRangeChange: PropTypes.func,
  onFromDateChange: PropTypes.func,
  onToDateChange: PropTypes.func,
  theme: PropTypes.object,
  disabledDays: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.object,
  ]),
};

DateRangePickerInput.defaultProps = {
  name: {
    from: undefined,
    to: undefined,
  },
  label: {
    from: undefined,
    to: undefined,
  },
  placeholder: {
    from: 'From: YYYY-MM-DD',
    to: 'To: YYYY-MM-DD',
  },
  defaultValue: {
    from: '',
    to: '',
  },
  disabled: {
    from: false,
    to: false,
  },
  format: 'YYYY-MM-DD',
  onDateRangeChange: () => {},
  onFromDateChange: () => {},
  onToDateChange: () => {},
};

DateRangePickerInput.contextTypes = {
  formik: PropTypes.object,
};

export default withTheme(
  DateRangePickerInput,
);
