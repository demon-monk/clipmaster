import * as React from "react";

import { clipboard, ipcRenderer } from "electron";
import database from './database'

interface Clipping {
  content: string
  id: number
}

const writeToClipboard = (content: string) => {
  clipboard.writeText(content);
};

export class App extends React.Component<
  undefined,
  { clippings: Clipping[] }
> {
  constructor() {
    super();
    this.state = {
      clippings: []
    };

    this.addClipping = this.addClipping.bind(this);
    this.handleWriteToClipboard = this.handleWriteToClipboard.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on("create-new-clipping", this.addClipping);
    ipcRenderer.on("write-to-clipboard", this.handleWriteToClipboard)
    this.fetchClippings()
  }

  fetchClippings = () => {
    database('clippings')
      .select<Clipping[]>() // select * from clippings
      .then((clippings) => this.setState({ clippings }))
  }

  addClipping() {
    const content = clipboard.readText();
    // insert new record into table
    database('clippings').insert({ content }).then(this.fetchClippings)
  }

  handleWriteToClipboard() {
    const clipping = this.state.clippings[0];
    if (clipping) writeToClipboard(clipping.content);
  }

  onRemove = (id: number) => {
    database('clippings').where('id', id).delete().then(this.fetchClippings)
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
            {this.state.clippings.map(({ content, id }) => (
              <Clipping content={content} id={id} key={id} onRemove={this.onRemove} />
            ))}
          </div>
        </section>
      </div>
    );
  }
}

const Clipping = (props: {content: string, id: number, onRemove: (id: number) => void}) => {
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
        <button className="remove-clipping" onClick={() => props.onRemove(props.id)}>Remove</button>
      </div>
    </article>
  );
};
