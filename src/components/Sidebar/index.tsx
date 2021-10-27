/* eslint-disable no-console */
// @ts-nocheck

import { FunctionComponent, h } from "preact";
import register from "preact-custom-element";
import { FC } from "preact/compat/src";
import { useEffect, useRef, useState } from "preact/hooks";
import styled from "styled-components";
import App from "../../App";
import useCustomEvent from "../../utils/useCustomEvent";
import LogoIcon from "./LogoIcon";

type MenuItem = {
  id?: string;
  label: string;
};
type Section = {
  label?: string;
  items: MenuItem[];
};
interface Props {
  data: string;
  activemenuitem?: string;
}

const Logo = () => (
  <div className="logo">
    <LogoIcon />
  </div>
);

const Section: FC<{ section: Section; isActive: MenuItem; clickHandler: any }> =
  ({ section, isActive, clickHandler }) => (
    <StyledSection>
      {section.label && <h5>{section.label}</h5>}
      <ul>
        {section.items.map((item, index) => (
          <li key={item.label}>
            <MenuItem
              tabIndex={-index}
              isActive={isActive && isActive.label === item.label}
              type="button"
              onClick={() => clickHandler(item)}
              onKeyPress={() => clickHandler(item)}
            >
              {item.label}
            </MenuItem>
          </li>
        ))}
      </ul>
    </StyledSection>
  );

const Sidebar: FunctionComponent<Props> = ({ data, activemenuitem }) => {
  const [dataState, setData] = useState<Section[]>([]);
  const [active, setActive] = useState<MenuItem | null>(null);

  const componentRef = useRef<HTMLDivElement>();

  const dispatchEvent = useCustomEvent({
    ref: componentRef,
    eventName: "menuItemClicked",
  });

  const clickHandler = (item) => {
    setActive(item);
    dispatchEvent(item);
  };

  useEffect(() => {
    if (data) {
      const parsedData = JSON.parse(data);
      setData(parsedData);

      if (activemenuitem) {
        parsedData.map((section) => {
          const filter = section.items.filter(
            (item) => item.label.toLowerCase() === activemenuitem.toLowerCase()
          );

          if (!filter.length) return;
          // @ts-ignore
          setActive(...filter);
        });
      }
    }
  }, [data, activemenuitem]);

  if (!dataState) return null;
  return (
    <App>
      <StyledBar ref={componentRef}>
        <Logo />
        {dataState.map((section) => (
          <Section
            key={section.label}
            section={section}
            isActive={active}
            clickHandler={clickHandler}
          />
        ))}
      </StyledBar>
    </App>
  );
};

const StyledBar: any = styled.div`
  height: 100vh;
  width: 220px;
  background: ${(props) => props.theme.sidebar.colors.$bg};
  color: ${(props) => props.theme.colors.$D80};

  .logo {
    padding: 0 24px;
    height: 108px;
    display: flex;
    align-items: center;
  }
`;

const StyledSection: any = styled.div<{ isActive: Boolean }>`
  &:last-child:after {
    display: none;
  }
  &:after {
    content: "";
    margin: 0 24px;
    height: 36px;
    position: relative;
    display: block;
    box-shadow: inset 0 -17px 0 0 ${(props) => props.theme.sidebar.colors.$bg},
      inset 0 -18px 0 0 ${(props) => props.theme.sidebar.colors.$divider};
  }

  & h5 {
    font-size: 12px;
    font-weight: 500;
    color: ${(props) => props.theme.colors.$D40};
    height: 36px;
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0 24px;
  }

  & ul {
    list-style: none;
    padding: 0;
    margin: 0;

    & li {
      display: flex;
    }
  }
`;

const MenuItem: any = styled.button<{ isActive: Boolean }>`
  height: 36px;
  padding: 0 24px;
  width: 100%;
  font-size: 14px;
  background: ${(props) =>
    props.isActive ? props.theme.sidebar.colors.$bgActive : "none"};
  text-align: left;
  color: ${(props) =>
    props.isActive ? props.theme.colors.$B10 : props.theme.colors.$D80};
  border: none;
  &:hover {
    background: ${(props) =>
      !props.isActive && props.theme.sidebar.colors.$bgHover};
    outline: none;
    cursor: pointer;
  }
  &:focus {
    background: ${(props) => props.theme.sidebar.colors.$bgHover};
    outline: none;
  }
`;

register(Sidebar, "x-sidebar", ["data", "activemenuitem"]);

export default Sidebar;
