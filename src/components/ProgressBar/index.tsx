/* eslint-disable no-param-reassign */

import { h } from "preact";
import register from 'preact-custom-element';
import { useEffect, useRef, useState } from "preact/compat";
import App from "../../App"

type Props = {
    size?: Number,
    color?: String,
    className?: String,
    delay?: Number
}

const Bar = (config: Props) => {
    const assign = (to, from) => {
        Object.keys(from || {}).forEach((key) => {
            to[key] = from[key];
        });
        return to;
    };

    config = assign(
        {
            size: 2,
            color: "#29e",
            className: "bar-of-progress",
            delay: 80,
        },
        config,
    );

    const initialStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        border: "none",
        borderRadius: 0,
        backgroundColor: "currentColor",
        zIndex: 10000,
        height: typeof config.size === "number" ? `${config.size}px` : config.size,
        color: config.color,
        opacity: 0,
        width: "0%",
    };

    const startedStyle = {
        opacity: 1,
        width: "99%",
        transition: "width 10s cubic-bezier(0.1, 0.05, 0, 1)",
    };

    const finishedStyle = {
        opacity: 0,
        width: "100%",
        transition: "width 0.1s ease-out, opacity 0.5s ease 0.2s",
    };

    const glowStyle = {
        opacity: 0.4,
        boxShadow: "3px 0 8px",
        height: "100%",
    };

    let current;
    let timeout;

    const start = () => {
        if (current && current.parentNode) {
            current.parentNode.removeChild(current);
        }
        current = document.body.appendChild(document.createElement("div"));
        current.className = `${config.className} stopped`;
        assign(current.style, initialStyle);

        const glow = current.appendChild(document.createElement("div"));
        glow.className = "glow";
        assign(glow.style, glowStyle);

        if (timeout != null) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(() => {
            timeout = null;
            current.className = `${config.className} started`;
            assign(current.style, startedStyle);
        }, config.delay);

        // Force a reflow, just to be sure that the initial style takes effect.
        current.scrollTop = 0;
    };

    const finish = () => {
        if (timeout != null) {
            clearTimeout(timeout);
            timeout = null;
        }
        if (current) {
            current.className = `${config.className} finished`;
            assign(current.style, finishedStyle);
        }
    };

    return { finish, start }
}


const ProgressBar = ({ state }) => {
    const [progressState, setState] = useState(state);
    const progress = Bar({ size: 2, color: "#3899EC", delay: 100 });
    const compponentRef = useRef();


    useEffect(() => {
        setState(state)
    }, [state]);

    useEffect(() => {
        if (progressState === 'run') {
            progress.start()
            setTimeout(() => {
                progress.finish();
                setState('finish')
            }, 2000);
        }
    }, [progressState]);

    return (
      <App ref={compponentRef} />
    )
}


register(ProgressBar, 'x-progressbar', ['state']);
