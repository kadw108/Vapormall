// Adds wrapper HTML to snippet. Mimics Twine StoryInterface passage functionality.

/*
STRUCTURE BEFORE:

<div id="iff-story"> (added automatically by Iffinity)
    <div id="iff-snippet"> (added automatically by Iffinity; has actual contents of snippet)
        [SNIPPET CONTENTS]
    </div>
</div>

iff-story and iff-snippet are necessary; Iffinity won't work without them.

*/

import {h} from "dom-chef";

export function addWrapperHtml() {
    if (document.getElementById("contents") === null) {
        const iffSnippet = document.getElementById("iff-snippet");
        if (iffSnippet === null) {
            console.error("iffSnippet is null");
            return;
        }
        iffSnippet.remove();

        const contents = (
            <div id="contents">
                <div id="bg" className="fullscreenBg"></div>
                <div id="screenCover" className="fullscreenBg"></div>
                <div id="passages"><div className="passage">
                    <div id="screenBg"></div>

                    <div id="screenContents" className="absoluteAlign">
                        {iffSnippet}
                    </div>
                </div></div>
            </div>
        );
        document.getElementById("iff-story")?.appendChild(contents);
    }
}