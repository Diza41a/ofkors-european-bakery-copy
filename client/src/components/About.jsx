/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import i18n from '../i18n';
import { HOST, PROXY_PORT } from '../../../config';

const getRandomIndexes = (amount, outOf) => {
  if (amount > outOf) {
    // eslint-disable-next-line no-param-reassign
    amount = outOf;
  }
  const indexes = [];
  while (indexes.length < amount) {
    const index = Math.floor(Math.random() * outOf);
    if (!indexes.includes(index)) {
      indexes.push(index);
    }
  }
  return indexes;
};

export default function About() {
  const { t } = useTranslation();

  const [storyMeta, setStoryMeta] = useState({
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,'
     + 'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      + 'Malesuada nunc vel risus commodo viverra maecenas accumsan. Maecenas'
       + 'ultricies mi eget mauris. Purus faucibus ornare suspendisse sed nisi'
        + 'lacus sed viverra. Sit amet volutpat consequat mauris nunc. Amet commodo'
         + 'nulla facilisi nullam vehicula. Sed felis eget velit aliquet sagittis id consectetur.'
         + ' Fringilla est ullamcorper eget nulla facilisi.',
    hero1Url: './assets/images/couple1.png',
    hero2Url: './assets/images/couple2.png',
  });
  const [gallery, setGallery] = useState({
    imageUrls: [
      'https://scontent-mia3-2.cdninstagram.com/v/t51.2885-15/258861631_630623157964639_1100175305757122439_n.webp?stp=dst-jpg_e35_s1080x1080&_nc_ht=scontent-mia3-2.cdninstagram.com&_nc_cat=107&_nc_ohc=L3pXfohrAigAX8eafFx&edm=ABmJApABAAAA&ccb=7-5&ig_cache_key=MjcxMTMyNzcyMDA1ODM3NTg4NA%3D%3D.2-ccb7-5&oh=00_AT8t3PhkGGgwtShYRevim0e77HQKIwtRIrdlEk7aNyln5A&oe=62E038B8&_nc_sid=6136e7',
      'https://scontent-mia3-2.cdninstagram.com/v/t51.2885-15/251401429_2362664823865601_1999062833229197628_n.webp?stp=dst-jpg_e35_s1080x1080&_nc_ht=scontent-mia3-2.cdninstagram.com&_nc_cat=105&_nc_ohc=lWNLZarS_hUAX83NOeB&edm=ABmJApABAAAA&ccb=7-5&ig_cache_key=MjY5ODM4MjQyNTQxODg4MTAyOQ%3D%3D.2-ccb7-5&oh=00_AT-EYYg-ON0xamhrEAPoiHAVJw1IPs4J-kcMBEwoYCUNiA&oe=62DF5508&_nc_sid=6136e7',
      'https://scontent-mia3-1.cdninstagram.com/v/t51.2885-15/252105581_921273892089553_3218250753991243785_n.webp?stp=dst-jpg_e35_s1080x1080&_nc_ht=scontent-mia3-1.cdninstagram.com&_nc_cat=101&_nc_ohc=cMuepCMcnP0AX8FCeef&edm=ABmJApABAAAA&ccb=7-5&ig_cache_key=MjY5ODM4MTgxMTY1Nzc5ODk1Mw%3D%3D.2-ccb7-5&oh=00_AT_v5vBKjEXQbrywVZpmq0VVc910oC3hEsBYYe9VvU7PFA&oe=62DEAE32&_nc_sid=6136e7',
      'https://scontent-mia3-1.cdninstagram.com/v/t51.2885-15/252095975_710485403677024_8897563419179475654_n.webp?stp=dst-jpg_e35_s1080x1080&_nc_ht=scontent-mia3-1.cdninstagram.com&_nc_cat=104&_nc_ohc=duA7KXRfayUAX-O5yQq&edm=ABmJApABAAAA&ccb=7-5&ig_cache_key=MjY5ODM4MTM2MjkzNDQwNzYyMA%3D%3D.2-ccb7-5&oh=00_AT9eGcr8HJGdJnPv_DZ9sEVpAm66G41qMVjjEVuXyOTNHg&oe=62DED1EC&_nc_sid=6136e7',
      'https://scontent-mia3-1.cdninstagram.com/v/t51.2885-15/247737771_1005986923312681_31398212419925507_n.webp?stp=dst-jpg_e35_s1080x1080&_nc_ht=scontent-mia3-1.cdninstagram.com&_nc_cat=101&_nc_ohc=DH87nF9_fNIAX83npOE&edm=ABmJApABAAAA&ccb=7-5&ig_cache_key=MjY5MTczNTI5MTA0NTkzMjQ2Mg%3D%3D.2-ccb7-5&oh=00_AT9RPl0D5pF4NMLQ21zqbEuORdzG5yvf7agVgB-joWiakQ&oe=62DFAC81&_nc_sid=6136e7',
      'https://scontent-mia3-1.cdninstagram.com/v/t51.2885-15/199055139_4142265195855258_1214358492356835044_n.jpg?se=7&stp=dst-jpg_e35&_nc_ht=scontent-mia3-1.cdninstagram.com&_nc_cat=106&_nc_ohc=sypzn5Tj12gAX-S6rTo&edm=ABmJApABAAAA&ccb=7-5&ig_cache_key=MjU5Mzg4MTk5ODEzNDkyNzI3NA%3D%3D.2-ccb7-5&oh=00_AT_dqmYGgDRPqI3BoQX8p_K0Rz-6oTQYubjrvinJJPHrKQ&oe=62DEF4C8&_nc_sid=6136e7',
      'https://scontent-mia3-1.cdninstagram.com/v/t51.2885-15/185980300_757541358208945_7477424906672975549_n.jpg?se=7&stp=dst-jpg_e35&_nc_ht=scontent-mia3-1.cdninstagram.com&_nc_cat=101&_nc_ohc=j7kLa8rHP1sAX-0rlrk&edm=ABmJApABAAAA&ccb=7-5&ig_cache_key=MjU3NTE5NTQ3MTEyNTMyNTk0Mg%3D%3D.2-ccb7-5&oh=00_AT-MDXYji9IpRFooMmhgzsXISrqIyzY87u02_SzttpelDw&oe=62DE828C&_nc_sid=6136e7',
      'https://scontent-mia3-1.cdninstagram.com/v/t51.2885-15/188003136_932802134234111_4425000180806898143_n.jpg?se=7&stp=dst-jpg_e35&_nc_ht=scontent-mia3-1.cdninstagram.com&_nc_cat=111&_nc_ohc=EZbGuQHdxYUAX-FOLPM&edm=ABmJApABAAAA&ccb=7-5&ig_cache_key=MjU3NTE2NjEzMDkxMTc5NjY3Nw%3D%3D.2-ccb7-5&oh=00_AT8O-stMk6JuKCFPAKGIPzaI_SZZtXDdNS8rrePVr1mOqQ&oe=62DF5E48&_nc_sid=6136e7',
      'https://scontent-mia3-1.cdninstagram.com/v/t51.2885-15/186208670_453356112426576_6122559193236338729_n.jpg?se=7&stp=dst-jpg_e35&_nc_ht=scontent-mia3-1.cdninstagram.com&_nc_cat=100&_nc_ohc=XQFWsXsxHbMAX-5xKPM&edm=ABmJApABAAAA&ccb=7-5&ig_cache_key=MjU3NTE2MTgyMTE4OTA0MzcwOQ%3D%3D.2-ccb7-5&oh=00_AT_KmUAOaLJKFSHFt3zZVPcOoklv5IK4mA6NE9iMpqEOiw&oe=62DED8D2&_nc_sid=6136e7',
      'https://scontent-mia3-1.cdninstagram.com/v/t51.2885-15/186754926_378597220119364_6409845161952643734_n.jpg?se=7&stp=dst-jpg_e35&_nc_ht=scontent-mia3-1.cdninstagram.com&_nc_cat=104&_nc_ohc=ERnDLl_4ITUAX-hmLRi&edm=ABmJApABAAAA&ccb=7-5&ig_cache_key=MjU3NTE1ODcxNzkwNzM5NjIyOQ%3D%3D.2-ccb7-5&oh=00_AT-mvDW8UQc5SbjL_LXbz5Grk5PjTksdV3JhEeaGi4yoDA&oe=62DEF8F4&_nc_sid=6136e7',
      'https://scontent-mia3-1.cdninstagram.com/v/t51.2885-15/187630065_112868824302637_1518014258717001745_n.jpg?se=7&stp=dst-jpg_e35&_nc_ht=scontent-mia3-1.cdninstagram.com&_nc_cat=101&_nc_ohc=PmeXXbXeFH4AX8BEuzy&edm=ABmJApABAAAA&ccb=7-5&ig_cache_key=MjU3NTE1MzcyNDgyMzQxNzA0Mw%3D%3D.2-ccb7-5&oh=00_AT-UM5YPetN2_ajpWq4EKsc4O6YfEwFuoRqIBPxkzhINaA&oe=62DF3295&_nc_sid=6136e7',
      'https://scontent-mia3-2.cdninstagram.com/v/t51.2885-15/185903172_1129059484282301_4344092765508702391_n.jpg?se=7&stp=dst-jpg_e35&_nc_ht=scontent-mia3-2.cdninstagram.com&_nc_cat=105&_nc_ohc=_2yoheCMpHMAX-OC_Jq&edm=ABmJApABAAAA&ccb=7-5&ig_cache_key=MjU3NTEzNzM3OTQyNzYzNDY1Nw%3D%3D.2-ccb7-5&oh=00_AT-igaXATkOadonDkNdEwu-dWQyPaVsnK3nkWDO2am8xNQ&oe=62DE777E&_nc_sid=6136e7',
    ],
    videoUrls: ['https://scontent-mia3-2.cdninstagram.com/v/t50.2886-16/122126391_267431514605614_4642113791326584472_n.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6InZ0c192b2RfdXJsZ2VuLjcyMC5mZWVkLmRlZmF1bHQifQ&_nc_ht=scontent-mia3-2.cdninstagram.com&_nc_cat=110&_nc_ohc=t-xr4vcKw6EAX9sYkyH&edm=ABmJApABAAAA&vs=17856641582279654_3337093831&_nc_vs=HBkcFQAYJEdEZUFSd2N1Q0c1QU92TUFBSmhfOXZMbEdXeEFia1lMQUFBRhUAAsgBACgAGAAbAYgHdXNlX29pbAEwFQAAJsy8xYyrobg%2FFQIoAkMzLBdAIWZmZmZmZhgSZGFzaF9iYXNlbGluZV8xX3YxEQB16gcA&_nc_rid=344a7276cc&ccb=7-5&oe=62DA6DDF&oh=00_AT_1rIdFM7h97WE3I5E3D2UVz0UR0nzU-HXdLgfPaBFz7Q&_nc_sid=6136e7'],
  });
  const [selectedMedia, setSelectedMedia] = useState({
    imageIndexes: getRandomIndexes(9, gallery.imageUrls.length),
    videoIndex: getRandomIndexes(1, gallery.videoUrls.length)[0],
  });
  const [currIndex, setCurrIndex] = useState(0);

  // Rendering
  // Gallery
  const renderGallery = () => (
    <div className="gallery">
      <div className="laptop-wrap">
        <img src="./assets/images/laptop-frame.png" alt="" className="laptop-img" />
        <div className="laptop-content">
          {(() => {
            // Video validation + proxy
            axios.get(`http://${HOST}:${PROXY_PORT}/${gallery.videoUrls[selectedMedia.videoIndex]}`)
              .then(() => {
                document.querySelector('#video').src = `http://${HOST}:${PROXY_PORT}/${gallery.videoUrls[selectedMedia.videoIndex]}`;
              })
              .catch((err) => console.log(err));

            return (
              <video
                crossOrigin="anonymous"
                preload="metadata"
                id="video"
                muted
                controls
                src=""
                height="100%"
                width="100%"
              >
                <track
                  default
                  kind="captions"
                  srcLang="en"
                  src=""
                />
                Sorry, your browser does not support embedded videos.
              </video>
            );
          })()}
        </div>
      </div>

      {selectedMedia.imageIndexes.map((i, j) => {
        // Image validation + proxy
        axios.get(`http://${HOST}:8080/${gallery.imageUrls[i]}`)
          .then(() => {
            document.querySelector(`img.img-internal[data-id='${i}']`).src = `http://${HOST}:8080/${gallery.imageUrls[i]}`;
          })
          .catch((err) => console.log(err));

        return (
          <div className="img" key={i}>
            <img
              className="img-internal"
              data-index={j}
              data-id={i}
              alt="gallery item"
              loading="lazy"
              crossOrigin="anonymous"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('gallery-modal-wrap')?.classList.remove('hidden');
                setCurrIndex(parseInt(e.target.getAttribute('data-index'), 10));
              }}
            />
          </div>
        );
      })}

      <div className="button-wrap">
        <button
          id="refresh-gallery-btn"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            setSelectedMedia({
              imageIndexes: getRandomIndexes(9, gallery.imageUrls.length),
              videoIndex: getRandomIndexes(1, gallery.videoUrls.length)[0],
            });
          }}
        >
          {`${t('about.refresh')} `}
          <i className="fa-solid fa-arrows-rotate icon" />
        </button>
      </div>
    </div>
  );

  // ComponentDidMount
  useEffect(() => {
    let newStoryMeta = null;
    let newInstagramFeed = null;
    axios.get('/fixedData?field=story')
      .then(({ data }) => {
        newStoryMeta = data;
      })
      .catch((err) => console.log(err))
      .finally(() => {
        axios.get('/instagramFeed')
          .then(({ data }) => {
            newInstagramFeed = data;
          })
          .catch((err) => console.log(err))
          .finally(() => {
            if (newStoryMeta !== null) {
              setStoryMeta(newStoryMeta);
            }
            if (newInstagramFeed !== null) {
              setGallery(newInstagramFeed);
            }
            setSelectedMedia({
              imageIndexes: getRandomIndexes(9, newInstagramFeed.imageUrls.length),
              videoIndex: getRandomIndexes(1, newInstagramFeed.videoUrls.length)[0],
            });
          });
      });
  }, []);

  useEffect(() => {
    const { src } = document.querySelector(`[data-index='${currIndex}']`);
    if (src !== undefined || src !== null) {
      axios.get(`http://${HOST}:8080/${src}`)
        .then(() => {
          document.querySelector('.img-expanded').src = `http://${HOST}:8080/${src}`;
        })
        .catch((err) => console.log(err));
    }
  }, [currIndex]);

  return (
    <div className="about-us-section">
      <div className="hero-wrap">

        <div className="hero">
          {/* Animation */}
          <div className="bg" />
          <div className="bg bg2" />
          <div className="bg bg3" />

          <h1 className="title">{t('about.hero')}</h1>
        </div>
      </div>

      <div className="about-us-body-wrap">
        <section className="our-story">
          <div className="text">
            <h3 className="title">
              <span>{t('about.story-header-our')}</span>
              {t('about.story-header-story')}
            </h3>
            <p>
              {(() => {
                // 'українська', 'русский', 'english'
                const lang = i18n.language;
                if (lang === 'english') {
                  return storyMeta.text.en;
                } if (lang === 'русский') {
                  return storyMeta.text.ru;
                } if (lang === 'українська') {
                  return storyMeta.text.uk;
                }
                return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod'
                + 'tempor incididunt ut labore et dolore magna aliqua. Malesuada nunc vel risus commodo '
                + 'viverra maecenas accumsan. Maecenas ultricies mi eget mauris. Purus faucibus ornare'
                + ' suspendisse sed nisi lacus sed viverra. Sit amet volutpat consequat mauris nunc. '
                + 'Amet commodo nulla facilisi nullam vehicula. Sed felis eget velit aliquet sagittis'
                + ' id consectetur. Fringilla est ullamcorper eget nulla facilisi. At in tellus integer'
                + ' feugiat scelerisque varius morbi enim. Lacus vel facilisis volutpat est.'
                + ' Tempus quam pellentesque nec nam aliquam sem. Aliquet bibendum enim facilisis gravida'
                + ' neque convallis a.';
              })()}
            </p>
          </div>

          <div className="images">
            <div className="image" id="first-hero" style={{ backgroundImage: `url('${storyMeta.hero1Url || './assets/images/couple1.png'}')` }} />
            <div className="image" id="second-hero" style={{ backgroundImage: `url('${storyMeta.hero2Url || './assets/images/couple2.png'}')` }} />
          </div>
        </section>

        <section className="gallery-wrap">
          <div className="social-media-links">
            <h4 className="social-media-header">{t('about.snippets')}</h4>
            <a href="https://www.facebook.com/OfKors-Bakery-on-Cattlemen-138007417031393" target="_blank" rel="noreferrer" className="facebook">
              <img src="./assets/images/icons/facebook-logo.svg" alt="" />
            </a>
            <a href="https://www.instagram.com/ofkors_bakery/" className="instagram" target="_blank" rel="noreferrer">
              <img src="./assets/images/icons/instagram-logo.svg" alt="" />
            </a>
          </div>

          {renderGallery()}

        </section>
      </div>

      {/* Gallery modal -> TODO: Postpone till later releases */}
      <div
        id="gallery-modal-wrap"
        className="hidden"
        onClick={(e) => {
          if (e.target?.classList.contains('img-expanded')) {
            return;
          }
          document.getElementById('gallery-modal-wrap')?.classList.add('hidden');
        }}
      >
        <div className="image-wrap">
          <img src="./assets/images/couple1.png" className="img-expanded" alt="gallery expanded" crossOrigin="anonymous" />
        </div>

        {/* Render image carousel */}
        {/* <div className="image-carousel">
          {(() => {
            const getNavBtns = () => {
              const makeImg = (srcIndex, className) => (
                <img
                  src={srcIndex !== -1 ? `http://${HOST}:8080/${document.querySelector(`[data-index='${srcIndex}']`)?.src}` : ''}
                  className={className !== -1 ? className : ''}
                  alt=""
                  crossOrigin="anonymous"
                />
              );

              if (gallery.imageUrls.length < 1) {
                return null;
              }

              if (currIndex === 0) {
                return (
                  <>
                    <button type="button" className="invisible" id="carousel-left">{'<'}</button>
                    {makeImg(-1, 'invisible')}
                    {makeImg(currIndex, 'selected')}
                    {makeImg(currIndex + 1, -1)}
                    <button type="button" id="carousel-right">{'>'}</button>
                  </>
                );
              }
              if (currIndex === 8) {
                return (
                  <>
                    <button type="button" id="carousel-left">{'<'}</button>
                    {makeImg(currIndex - 1, -1)}
                    {makeImg(currIndex, 'selected')}
                    {makeImg(-1, 'invisible')}
                    <button type="button" className="invisible" id="carousel-right">{'>'}</button>
                  </>
                );
              }
              return (
                <>
                  <button type="button" id="carousel-left">{'<'}</button>
                  {makeImg(currIndex - 1, -1)}
                  {makeImg(currIndex, 'selected')}
                  {makeImg(currIndex + 1, -1)}
                  <button type="button" id="carousel-right">{'>'}</button>
                </>
              );
            };

            return (getNavBtns());
          })()}
        </div> */}

        <button
          id="gallery-modal-close-btn"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('gallery-modal-wrap')?.classList.add('hidden');
          }}
        >
          X
        </button>
      </div>

    </div>
  );
}
