import React from 'react'

const CustomFlux = ({generateImage, width,
    setWidth,
    height,
    setHeight}) => {
  return (
    <div>
      <form onSubmit={generateImage}>
    <label>
        Genişlik:
        <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Math.min(e.target.value, 1500))}
            max="1500"
        />
    </label>
    <label>
        Yükseklik:
        <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Math.min(e.target.value, 1500))}
            max="1500"
        />
    </label>
</form>

    </div>
  )
}

export default CustomFlux
