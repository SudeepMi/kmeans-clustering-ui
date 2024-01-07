import React, { useState } from 'react';
import skmeans from 'skmeans';


const KMeansClustering = () => {
    const [numClusters, setNumClusters] = useState('');
    const [results, setResults] = useState(null);
    const [initialCenterIndex, setICI] = useState(1);

    const [numItems, setNumItems] = useState('');
    const [numDimensions, setNumDimensions] = useState('');
    const [data, setData] = useState([]);


    const handleInputChange = (rowIndex, colIndex, value) => {

        const updatedData = [...data];
        if (!updatedData[rowIndex]) {
            updatedData[rowIndex] = [];
        }

        updatedData[rowIndex][colIndex] = parseFloat(value);


        setData(updatedData);
        localStorage.setItem("data", JSON.stringify(updatedData));

    };


    const handleCluster = () => {

        const parsedNumClusters = parseInt(numClusters, 10);


        if (isNaN(parsedNumClusters)) {
            alert('Please enter valid numbers for all inputs.');
            return;
        }

        var res = skmeans(data, parsedNumClusters, "kmpp");

        const _data = JSON.parse(localStorage.getItem("data"));
        setData(_data);

        let _jj = [];

        res.idxs.forEach((v, i) => {
            if (!_jj[v]) {
                _jj[v] = [];
            }
            _jj[v].push(_data[i]);
        })

        // Set the results in the state
        setResults({ centroids: res.centroids, clusters: _jj, iteration: res.it, test: res.test, idx: res.idxs });
    };

    const generateInputFields = () => {

        const rows = [];
        for (let i = 0; i < parseInt(numItems, 10); i++) {
            const cols = [];
            for (let j = 0; j < parseInt(numDimensions, 10); j++) {
                cols.push(
                    <input
                        key={`input_${i}_${j}`}
                        type="text"
                        placeholder={`Item ${i + 1}, Dimension ${j + 1}`}
                        onChange={(e) => handleInputChange(i, j, e.target.value)}
                    />
                );
            }
            rows.push(
                <div key={`row_${i}`} className="input-row">
                    {cols}
                </div>
            );
        }
        return rows;
    };


    return (
        <div className='wrapper'>
            <div className='form'>
                <h1>K-Means++ Clustering</h1>
                <label>
                    Number of Items:
                    <input type="text" value={numItems} onChange={(e) => setNumItems(e.target.value)} />
                </label>

                <label>
                    Number of Dimensions:
                    <input type="text" value={numDimensions} onChange={(e) => setNumDimensions(e.target.value)} />
                </label>
                <label>
                    Number of Cluster (k):
                    <input type="text" value={numClusters} onChange={(e) => setNumClusters(e.target.value)} />
                </label>


                {generateInputFields()}

                {/* Display entered data (for testing purposes) */}
                {data.length > 0 && (
                    <div>
                        <h2>Entered Data:</h2>
                        <table border={1} cellPadding={6} cellSpacing={0}>
                            <thead>
                                <tr>
                                    <th>Index</th>
                                    <th>Dimension 1</th>
                                    <th>Dimension 2</th>
                                </tr>
                            </thead>
                            <tbody>

                                {data.map((d, i) => {
                                    return <tr key={`${i + 1}__inputrows`} className={`color__${results!=null ? results.idx[i]: ""}`}>
                                        <td>{i + 1}</td>
                                        {
                                            d.map((_d, _i) => {
                                                return <td key={`${i + _i + d}---input_datas`}>{_d}</td>
                                            })
                                        }
                                    </tr>

                                })}
                            </tbody>
                        </table>
                    </div>
                )}
                <label>
                    initial center index:
                    <input type="text" value={initialCenterIndex} onChange={(e) => setICI(e.target.value)} />
                </label>
                <br />

                <button onClick={() => handleCluster()}>Proceed !!</button>
            </div>
            <div className="result">
                {results != null &&
                    <div>

                        <p className='bold green'>No. of Iteration {results.iteration}</p>
                        <p className='bold red'>No. of Clusters {numClusters}</p>

                        {
                            results.clusters.map((v, index) => {
                                return <div key={index} className='flex'>cluster {index + 1}: {
                                    v.map(_v => <p key={`cluster--${_v + Math.random() * 10}__${index}`} className='flex'>{_v.join(",")}</p>)
                                }</div>
                            })
                            // JSON.stringify(results.clusters)
                        }

                        {
                            results.centroids.map((v, index) => {
                                return <div key={index} className='flex centeroids'>centeroids {index + 1}: {
                                    
                                    v?.filter(v=>v.toFixed(2)).join(",")
                                }</div>
                            })
                            // JSON.stringify(results.clusters)
                        }
                    </div>
                }
                 <h4 className="flex">Made with <span className="b" style={{fontSize:30}}> &#10084; </span>{" "} By CodeWithSudeep</h4>
            <img src="./logo.png" width={"90px"} />
        </div>
        </div>

    );
};

export default KMeansClustering;
