/* eslint-disable import/no-extraneous-dependencies */
import { h } from "preact";
import { storiesOf } from "@storybook/preact";
import Skeleton from "./index";


storiesOf("Skeleton", module).add("Default", () => (<Skeleton height={16} />));
