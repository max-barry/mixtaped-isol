### 🚨 May 2022 Update

This vertical slice was edited in May 2022, and re-uploaded to a fresh repository to i. remove work that was done in a collaboration with others; ii. remove some work that isn't public-proof; and iii. be usable as reviewable code at a publicly available link. The full isolated slice can be found at the private link shared elsewhere.

## `mixtaped-isol`

This is a vertical slice of a project worked on over a single sprint in 2019, with a few newer ideas thrown in.

The full project was halted after the dataproc work hit a fairly terminal barrier. However, there was a duct-taped client-side prototype, and bits and pieces of the UI are solid enough that they've been sliced out for reference here.

The preview link for this vertical slice can be viewed here: [**mixtaped-isol-4483928182.web.app**](https://mixtaped-isol-4483928182.web.app/)

### Running the project locally

```sh
yarn
yarn start:client

# For the storybook
yarn start:storybook
```

There's an `.nvmrc` for environment.

All the Firebase work is remotely hosted, however it can be run locally (providing Firebase emulators are installed):

```sh
yarn
yarn start:firebase
```

### What's in the vertical slice?

- Some of the prototype tape-edit UI
- Various utilities pulled from different projects across the years, including:
  - A nifty hook for lazy loading SVG icons on-demand
  - Hooks for running functions on the next-lazy frame
  - Dynamic UI theming through palette picking imagery
  - High-perf picture tags and a [**rudimentary Cloudinary drop-in**](https://maxbarry.medium.com/dynamic-on-demand-image-resizing-using-firebase-hosting-and-google-cloud-functions-to-make-a-cheap-d64e8f5805d1)

### What's not in the vertical slice?

- Some third-party services were stripped out:
  - All of the [**Firestore**](https://firebase.google.com/products/firestore) work was stubbed out
  - [**Firebase authentication**](https://firebase.google.com/products/auth) - and hence permanence on the Sandbox
  - Algolia search
- The datastore was replaced with Valtio for speed, but it makes the data calls a bit loopy-loop
- None of the Python dataproc or server-side work was included, as some of the ways it retrieves publicly available data from Apple is a bit grey-area for a public link
