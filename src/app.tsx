import * as React from "react";

import { clipboard, ipcRenderer } from "electron";

const writeToClipboard = (content: string) => {
  clipboard.writeText(content);
};

export class App extends React.Component<
  undefined,
  { clippings: { content: string; id: number }[] }
> {
  constructor() {
    super();
    this.state = {
      clippings: [
        {
          content: "Lol",
          id: 123
        }
      ]
    };

    this.addClipping = this.addClipping.bind(this);
    this.handleWriteToClipboard = this.handleWriteToClipboard.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on("create-new-clipping", this.addClipping);
    ipcRenderer.on("write-to-clipboard", this.handleWriteToClipboard)
  }

  addClipping() {
    const { clippings } = this.state;

    const content = clipboard.readText();
    const id = Date.now();

    const clipping = { id, content };

    this.setState({
      clippings: [clipping, ...clippings]
    });
  }

  handleWriteToClipboard() {
    const clipping = this.state.clippings[0];
    if (clipping) writeToClipboard(clipping.content);
  }

  render() {
    return (
      <div className="container">
        <header className="controls">
          <button id="copy-from-clipboard" onClick={this.addClipping}>
            Copy from Clipboard
          </button>
        </header>

        <section className="content">
          <div className="clippings-list">
            {this.state.clippings.map(clipping => (
              <Clipping content={clipping.content} key={clipping.id} />
            ))}
          </div>
        </section>
      </div>
    );
  }
}

const Clipping = (props: {content: string}) => {
  return (
    <article className="clippings-list-item">
      <div className="clipping-text" disabled>
        {props.content}
      </div>
      <div className="clipping-controls">
        <button onClick={() => writeToClipboard(props.content)}>
          &rarr; Clipboard
        </button>
        <button>Update</button>
      </div>
    </article>
  );
};
