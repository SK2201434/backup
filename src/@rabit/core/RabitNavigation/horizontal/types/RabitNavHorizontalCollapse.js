import NavLinkAdapter from '@rabit/core/NavLinkAdapter';
import { styled, useTheme } from '@mui/material/styles';
import { useDebounce } from '@rabit/hooks';
import Grow from '@mui/material/Grow';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { memo, useMemo, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { Manager, Popper, Reference } from 'react-popper';
import withRouter from '@rabit/core/withRouter';
import RabitNavBadge from '../../RabitNavBadge';
import RabitNavItem from '../../RabitNavItem';
import RabitSvgIcon from '../../../RabitSvgIcon';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  color: theme.palette.text.primary,
  minHeight: 48,
  '&.active, &.active:hover, &.active:focus': {
    backgroundColor: `${theme.palette.secondary.main}!important`,
    color: `${theme.palette.secondary.contrastText}!important`,

    '&.open': {
      backgroundColor: 'rgba(0,0,0,.08)',
    },

    '& > .rabit-list-item-text': {
      padding: '0 0 0 16px',
    },

    '& .rabit-list-item-icon': {
      color: 'inherit',
    },
  },
}));

function isUrlInChildren(parent, url) {
  if (!parent.children) {
    return false;
  }

  for (let i = 0; i < parent.children.length; i += 1) {
    if (parent.children[i].children) {
      if (isUrlInChildren(parent.children[i], url)) {
        return true;
      }
    }

    if (parent.children[i].url === url || url.includes(parent.children[i].url)) {
      return true;
    }
  }

  return false;
}

function RabitNavHorizontalCollapse(props) {
  const [opened, setOpened] = useState(false);
  const { item, nestedLevel, dense } = props;
  const theme = useTheme();

  const handleToggle = useDebounce((open) => {
    setOpened(open);
  }, 150);

  return useMemo(
    () => (
      <ul className="relative px-0">
        <Manager>
          <Reference>
            {({ ref }) => (
              <div ref={ref}>
                <StyledListItem
                  button
                  className={clsx(
                    'rabit-list-item',
                    opened && 'open',
                    isUrlInChildren(item, props.location.pathname) && 'active'
                  )}
                  onMouseEnter={() => handleToggle(true)}
                  onMouseLeave={() => handleToggle(false)}
                  aria-owns={opened ? 'menu-rabit-list-grow' : null}
                  aria-haspopup="true"
                  component={item.url ? NavLinkAdapter : 'li'}
                  to={item.url}
                  end={item.end}
                  role="button"
                  sx={item.sx}
                  disabled={item.disabled}
                >
                  {item.icon && (
                    <RabitSvgIcon
                      color="action"
                      className={clsx('rabit-list-item-icon shrink-0', item.iconClass)}
                    >
                      {item.icon}
                    </RabitSvgIcon>
                  )}

                  <ListItemText
                    className="rabit-list-item-text"
                    primary={item.title}
                    classes={{ primary: 'text-13 truncate' }}
                  />

                  {item.badge && <RabitNavBadge className="mx-4" badge={item.badge} />}
                  <IconButton
                    disableRipple
                    className="w-16 h-16 ltr:ml-4 rtl:mr-4 p-0"
                    color="inherit"
                    size="large"
                  >
                    <RabitSvgIcon size={16} className="arrow-icon">
                      {theme.direction === 'ltr'
                        ? 'heroicons-outline:arrow-sm-right'
                        : 'heroicons-outline:arrow-sm-left'}
                    </RabitSvgIcon>
                  </IconButton>
                </StyledListItem>
              </div>
            )}
          </Reference>
          {ReactDOM.createPortal(
            <Popper
              placement={theme.direction === 'ltr' ? 'right' : 'left'}
              eventsEnabled={opened}
              positionFixed
            >
              {({ ref, style, placement, arrowProps }) =>
                opened && (
                  <div
                    ref={ref}
                    style={{
                      ...style,
                      zIndex: 999 + nestedLevel + 1,
                    }}
                    data-placement={placement}
                    className={clsx('z-999', !opened && 'pointer-events-none')}
                  >
                    <Grow in={opened} id="menu-rabit-list-grow" style={{ transformOrigin: '0 0 0' }}>
                      <Paper
                        className="rounded-8"
                        onMouseEnter={() => handleToggle(true)}
                        onMouseLeave={() => handleToggle(false)}
                      >
                        {item.children && (
                          <ul className={clsx('popper-navigation-list', dense && 'dense', 'px-0')}>
                            {item.children.map((_item) => (
                              <RabitNavItem
                                key={_item.id}
                                type={`horizontal-${_item.type}`}
                                item={_item}
                                nestedLevel={nestedLevel + 1}
                                dense={dense}
                              />
                            ))}
                          </ul>
                        )}
                      </Paper>
                    </Grow>
                  </div>
                )
              }
            </Popper>,
            document.querySelector('#root')
          )}
        </Manager>
      </ul>
    ),
    [dense, handleToggle, item, nestedLevel, opened, props.location.pathname, theme.direction]
  );
}

RabitNavHorizontalCollapse.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    icon: PropTypes.string,
    children: PropTypes.array,
  }),
};

RabitNavHorizontalCollapse.defaultProps = {};

const NavHorizontalCollapse = withRouter(memo(RabitNavHorizontalCollapse));

export default NavHorizontalCollapse;
