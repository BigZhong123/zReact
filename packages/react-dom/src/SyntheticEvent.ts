import { Container } from "hostConfig";
import { Props } from "shared/ReactTypes";

export const elementPropsKey = "__props";
const validEventTypeList = ["click"];

type EventCallback = (e: Event) => void;

interface Paths {
  capture: EventCallback[];
  bubble: EventCallback[];
}

export interface DomElement extends Element {
  [elementPropsKey]: Props;
}

interface SyntheticEvent extends Event {
  __stopPropagation: boolean;
}

export function updateFiberProps(node: DomElement, props: Props) {
  node[elementPropsKey] = props;
}

export function initEvent(container: Container, eventType: string) {
  if (!validEventTypeList.includes(eventType)) {
    console.warn("当前不支持", eventType, "事件");
    return;
  }

  if (__DEV__) {
    console.log("初始化事件", eventType);
  }

  container.addEventListener(eventType, (e) => {
    dispatchEvent(container, eventType, e);
  });
}

function createSyntheticEvent(e: Event) {
  const syntheticEvent = e as SyntheticEvent;
  syntheticEvent.__stopPropagation = false;
  const originStopProgapation = e.stopPropagation;

  syntheticEvent.stopPropagation = () => {
    syntheticEvent.__stopPropagation = true;
    if (originStopProgapation) {
      originStopProgapation();
    }
  };

  return syntheticEvent;
}

function dispatchEvent(container: Container, eventType: string, e: Event) {
  const tragetElement = e.target;

  if (tragetElement === null) {
    console.warn("事件不存在target", e);
  }

  // 收集沿途的事件
  const { capture, bubble } = collectPaths(
    tragetElement as DomElement,
    container,
    eventType
  );
  // 构造合成事件
  const se = createSyntheticEvent(e);
  // 遍历capture
  triggerEventFlow(capture, se);

  if (!se.__stopPropagation) {
    // 遍历bubble
    triggerEventFlow(bubble, se);
  }
}

function triggerEventFlow(paths: EventCallback[], se: SyntheticEvent) {
  for (let i = 0; i < paths.length; i++) {
    const callback = paths[i];
    callback.call(null, se);

    if (se.__stopPropagation) {
      break;
    }
  }
}

function getEventCallbackNameFromEventType(
  eventType: string
): string[] | undefined {
  return {
    click: ["onClickCapture", "onClick"],
  }[eventType];
}

function collectPaths(
  tragetElement: DomElement,
  container: Container,
  eventType: string
) {
  const paths: Paths = {
    capture: [],
    bubble: [],
  };

  while (tragetElement && tragetElement !== container) {
    // 收集
    const elementProps = tragetElement[elementPropsKey];
    if (elementProps) {
      // click -> onClick onClickCapture
      const callbackNameList = getEventCallbackNameFromEventType(eventType);

      if (callbackNameList) {
        callbackNameList.forEach((callbackName, i) => {
          const eventCallback = elementProps[callbackName];
          if (eventCallback) {
            if (i === 0) {
              // capture
              paths.capture.unshift(eventCallback);
            } else {
              paths.bubble.push(eventCallback);
            }
          }
        });
      }
    }

    tragetElement = tragetElement.parentNode as DomElement;
  }

  return paths;
}
