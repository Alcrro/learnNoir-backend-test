# 🎯 FEATURE: AI Lesson Media Generation

## 1. Preprocessing (LLM)

- [ ] Extract lesson content (title, blocks, text)
- [ ] Generate structured scenes:
  - text (simplified for voice)
  - image_prompt

- [ ] Remove redundancy:
  - eliminate repeated ideas
  - compress explanations
  - adapt for spoken format

---

## 2. Image Generation

- [ ] Create prompt template (consistent style)
- [ ] Call Image API (OpenAI / Stability)
- [ ] Generate 3–5 images per lesson
- [ ] Save images:
  - storage (Supabase bucket)
  - DB table `lesson_images`

- [ ] Link images to scene index

---

## 3. Voice Generation (TTS)

- [ ] Prepare final script (clean, natural speech)
- [ ] Add improvements vs raw doc:
  - shorter sentences
  - clearer transitions

- [ ] Call TTS API
- [ ] Save audio file (.mp3)
- [ ] Store in `lesson_audio`

---

## 4. Scene Builder

- [ ] Map:
  - scene text
  - image
  - audio timestamps

- [ ] Define duration per scene

---

## 5. Video (Remotion)

- [ ] Create base composition
- [ ] Render:
  - image per scene
  - text overlay
  - synced audio

- [ ] Export video per lesson

---

## 6. Backend API

- [ ] POST /generate-lesson-media
- [ ] Queue job (important, async)
- [ ] Status tracking:
  - pending
  - processing
  - done
  - failed

---

## 7. Database

- [ ] lesson_images
- [ ] lesson_audio
- [ ] lesson_video
- [ ] generation_status

---

## 8. Optimization

- [ ] Cache results (avoid regen)
- [ ] Limit generation per lesson
- [ ] Retry failed steps

---

## 9. UX (optional but important)

- [ ] "Generate media" button
- [ ] Progress indicator
- [ ] Preview images/audio

---

## 10. Future Improvements

- [ ] Difficulty-based voice (beginner vs advanced)
- [ ] Multiple voice styles
- [ ] Dynamic image styles
- [ ] Quiz voice generation
