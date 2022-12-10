import { message } from "ant-design-vue";

const notification = (type: string, text: string) => {
  message[type]({
    content: () => text,
    class: "notification__box",
  });
};

export { notification };
