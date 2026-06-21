---
title: "Beyond Prompting: Scene as the Primary Interface"
date: "2026-02-15"
tags: ["HCI", "AI", "Image Generation", "Bria", "Fibo", "Prompting"]
description: ""
---

The initial idea behind Penguin Studio was to stop treating image generation as “prompt in, pixels out,” and instead control it with a structured scene specification—specifically Bria’s [**Visual GenAI Language (VGL)**](https://docs.bria.ai/vgl). VGL is a human-readable JSON scene representation that sits inside the FIBO stack: when you generate an image, you also get the full VGL spec that produced it.

If you open that JSON, you immediately see why it matters. The scene is decomposed into explicit fields: background, camera, lighting, and a list of objects with attributes like position/size/style. Bria frames this as a “white box” architecture—every visual attribute is declared, disentangled, and (crucially) editable as data. The full schema and the motivation for training on long structured captions are laid out in the [FIBO technical report](https://arxiv.org/abs/2511.06876).

That representation has two obvious wins. First, it reduces the cognitive load of managing long prompts. You’re no longer stuffing camera, lighting, composition, and object constraints into one fragile string—you’re editing named parameters. And second, it gives you a path to locality. When lighting is a field, you can change lighting without implicitly renegotiating the chair. That’s the core promise of FIBO’s structured-caption training: disentangled control over visual factors because the model is supervised on a consistent set of fine-grained attributes rather than sparse prompts.

But I ran into a problem quickly: even with VGL, I was still “editing images” by typing. And we already know what goes wrong there. In text-driven diffusion, small prompt changes can lead to a completely different result (see [this paper](https://arxiv.gg/abs/2208.01626)), which is why many editing workflows end up requiring spatial masks to keep the edit from spilling everywhere. From a HCI perspective, we are still interfacing with high-dimensional outputs (images) using a low-dimensional input channel (a text string). So the real question became: **how do we keep the structured-state benefits of VGL, but use less prompting and have more efficient and controllable generation process?**

If we look at the current tools for image editing and content creation like Photoshop and Figma, Shneiderman’s [direct manipulation principles](https://www.cs.umd.edu/~ben/about.html)—continuous representation, physical actions instead of syntax, rapid reversible operations—explain why these tools feel “high bandwidth” even though your input device is just a mouse. [Hutchins et al.](http://xdel.ru/downloads/worrydream-mirror/Hutchins_1985_-_Direct_Manipulation_Interfaces.pdf) go one level deeper and argue that the “directness” comes from reducing the distance between what you mean and what the system lets you do. So I wonder if we can apply that to generative images: treat the image as a scene you operate on, and treat text as a serialization format --- building a bidirectional channel between texts and pixels through direct manipulation.

This methodology consists of two main ideas:

---

#### Make VGL objects editable on the canvas

VGL already has an `objects[]` list, so a natural move is to use those object descriptions to locate the corresponding regions in the generated image and create segmented masks for direct interactions. The catch is that VGL object descriptions are often too rich for segmentation: they’re written for humans and for the generator, not for a segmenter. Feed a segmentation model something like “a warrior wearing intricate armor with glowing runes” and you frequently get no mask.

So I added a small distillation layer: for each VGL object, I build a multi-tier description tuned for segmentation.

- Extract the head noun (warrior, chair, sword).
- Add only the visually discriminative modifiers (color/material/one or two distinctive properties).
- Produce a minimal “core” phrase (a warrior) and a slightly more descriptive variant (a warrior with a sword and shield).

Those short phrases are then used to prompt a segmentation model, such as [SAM 3](https://arxiv.org/abs/2511.16719) which calls “promptable concept segmentation”: concept prompts are short noun phrases (and/or exemplars), and the model returns masks (and identities) for all matching instances. If a minial phrase fails to segment the object, we can use the slightly more descriptive variant to prompt the model. Once I have masks, I treat them as layers. Selection becomes literal: click the object, get its boundary, then manipulate it locally—scale the mask to “make it larger,” drag it to reposition, etc. The important part is that these operations are no longer “text edits”; they’re structured transformations anchored to a concrete region.

---

#### Build the interface from VGL and log edits as deltas

Instead of continuously rewriting the VGL JSON into a new full prompt, I track user actions on the interfaces and also each element on the images to update the deltas:

- category changes (object / lighting / camera / background)
- which field changed (position / size / rotation / color / material / etc.)
- old value → new value
- one-line summary (for inspection and, if needed, a refinement instruction)

Dragging a mask records “object X moved by (Δx, Δy) in normalized image coordinates.” Adjusting a lighting widget records the previous and new lighting direction/temperature and yields summaries like “change lighting to golden hour” or “make shadows stronger.” At refinement time, these chnages and deltas are applied to the JSON scene state, and the summaries are compressed into a short modification instruction, and sends **(updated VGL + instruction + seed/provenance)** to the backend. This is where Bria’s approach is enabling: VGL is explicitly designed to make generation and editing into structured data operations—prompts become parameters, edits become key-value updates, and the model family is trained natively on that representation. It is an analogy to the `What-you-see-is-what-you-get (WYSIWYG)` paradigm in GUI where it becomes `What-you-edit-is-what-you-prompt (WYEIWYP)`, and users preview the changes and results first to have a better understanding and cognitive model of the scene and the model's behavior.

---

#### The iteration loop

Prompt-only iteration feels like a slot machine because each run re-samples too many degrees of freedom. With the Fibo model and the interaction paradigm designed above, we can make the iteration loop more deterministic and predictable:

- **Selection scopes intent** (the thing you clicked is the thing you change).
- **State preserves invariants** (what you didn’t edit stays specified).
- **Deltas make changes inspectable** (you can audit what changed and why).
- **Structured generation executes** (it is re-rendering an updated scene spec, not reinterpreting a new sentence).

Users end up interacting with the scene itself as the interface, while the system keeps the VGL in sync so the generator receives an explicit, low-ambiguity target.

For details on the implementation, please check the [repo](https://github.com/Constannnnnt/Penguin-Studio).
