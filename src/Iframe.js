import React from 'react';
import PropTypes from 'prop-types';

const Iframe = ({ src, content, style, sandbox, frameBorder, width, height, allowFullScreen }) => {
  const defaultStyle = {
    width: '100%',
    height: '100%',
    border: 'none',
    ...style,
  };

  return (
    <iframe
      src={src}
      srcDoc={content}
      style={defaultStyle}
      sandbox={sandbox}
      frameBorder={frameBorder}
      width={width}
      height={height}
      allowFullScreen={allowFullScreen}
    />
  );
};

Iframe.propTypes = {
  src: PropTypes.string,
  content: PropTypes.string,
  style: PropTypes.object,
  sandbox: PropTypes.string,
  frameBorder: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  allowFullScreen: PropTypes.bool,
};

Iframe.defaultProps = {
  src: null,
  content: '',
  style: {},
  sandbox: 'allow-scripts',
  frameBorder: '0',
  width: '100%',
  height: '100%',
  allowFullScreen: false,
};

export default Iframe;
