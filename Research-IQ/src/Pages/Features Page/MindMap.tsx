import { useContext, useEffect, useMemo, useState } from "react";

import {
  ReactFlow,
  Background,
  Controls,
  Position,
  MarkerType,
} from "@xyflow/react";

import type { Node, Edge } from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import dagre from "dagre";
import { useOption } from "../../Context/OptionsContext";
import { ThemeContextData } from "../../Context/ThemeContext";
import { getMindmap } from "../../API/getMindmap.ts";
import LoadingPage from "../../Components/LoadingPage.tsx";



// const response = {
//   paper_id: "cd4d61e1-b783-44e6-b580-ac933ea2b3c9",
//   mindmap: {
//     title:
//       "A Lightweight SAR Ship Detector Using End-to-End Image Preprocessing Network",
//     mindMap: {
//       name:
//         "A Lightweight SAR Ship Detector Using End-to-End Image Preprocessing Network",
//       type: "root",
//       children: [
//         {
//           name: "Introduction",
//           type: "section",
//           children: [
//             {
//               name: "Problem Statement",
//               type: "concept",
//               children: [
//                 {
//                   name: "Small-scale targets",
//                   type: "challenge",
//                 },
//                 {
//                   name: "Complex backgrounds",
//                   type: "challenge",
//                 },
//               ],
//             },
//             {
//               name: "Methodology",
//               type: "concept",
//               children: [
//                 {
//                   name: "E2IPNet",
//                   type: "algorithm",
//                 },
//                 {
//                   name: "CFGSPP",
//                   type: "algorithm",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           name: "Methodology",
//           type: "section",
//           children: [
//             {
//               name: "E2IPNet",
//               type: "algorithm",
//             },
//             {
//               name: "CFGSPP",
//               type: "algorithm",
//             },
//           ],
//         },
//         {
//           name: "Dataset",
//           type: "section",
//           children: [
//             {
//               name: "SSDD",
//               type: "dataset",
//             },
//             {
//               name: "HRSID",
//               type: "dataset",
//             },
//           ],
//         },
//         {
//           name: "Results",
//           type: "section",
//           children: [
//             {
//               name: "AP",
//               type: "metric",
//               children: [
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           name: "Results",
//           type: "section",
//           children: [
//             {
//               name: "AP",
//               type: "metric",
//               children: [
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           name: "Results",
//           type: "section",
//           children: [
//             {
//               name: "AP",
//               type: "metric",
//               children: [
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           name: "Results",
//           type: "section",
//           children: [
//             {
//               name: "AP",
//               type: "metric",
//               children: [
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           name: "Results",
//           type: "section",
//           children: [
//             {
//               name: "AP",
//               type: "metric",
//               children: [
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           name: "Results",
//           type: "section",
//           children: [
//             {
//               name: "AP",
//               type: "metric",
//               children: [
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           name: "Results",
//           type: "section",
//           children: [
//             {
//               name: "AP",
//               type: "metric",
//               children: [
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           name: "Results",
//           type: "section",
//           children: [
//             {
//               name: "AP",
//               type: "metric",
//               children: [
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           name: "Results",
//           type: "section",
//           children: [
//             {
//               name: "AP",
//               type: "metric",
//               children: [
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           name: "Results",
//           type: "section",
//           children: [
//             {
//               name: "AP",
//               type: "metric",
//               children: [
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//                 {
//                   name: "98.61%",
//                   type: "value",
//                 },
//               ],
//             },
//           ],
//         },

//       ],
//     },
//   },
// };

/******************************************************
 * Colours
 ******************************************************/

const colours: Record<string, string> = {
  amber: "#F7B313",
  orange: "#F44A06",

  // Teals & Greens
  teal: "#39B4A8",
  mint: "#9DCCA8",
  aqua: "#3AB7A9",

  // Supporting Accent
  // optional border highlight (slightly darker than cream)

  // Logo Stripe Colors
  coral: "#E86D4B",
  cyan: "#2DB8C3",
  gold: "#D7A93A",

  // UI Highlights
  success: "#8CCB8D",
  warning: "#F5B51A",
};
const getRandomColour = () => {
  const values = Object.values(colours);
  return values[Math.floor(Math.random() * values.length)];
};



const nodeWidth = 130;
const nodeHeight = 60;

function buildGraph(root: any) {
  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isMobile = window.innerWidth < 768;

  dagreGraph.setGraph({
    rankdir: isMobile ? "LR" : "TB",
    nodesep: isMobile ? 25 : 60,
    ranksep: isMobile ? 40 : 120,
  });
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  let id = 0;

  function traverse(node: any, parent?: string) {
    const currentId = String(id++);

    nodes.push({
      id: currentId,
      data: {
        label: node.name,
      },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      position: { x: 0, y: 0 },
      style: {
        width: nodeWidth,
        borderRadius: 0,
        border: 3,
        boxShadow: "4px 4px 0px #fff",
        background: getRandomColour() || "#444",
        fontWeight: 600,
      },
    });

    if (parent) {
      edges.push({
        id: `${parent}-${currentId}`,
        source: parent,
        target: currentId,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
      });
    }

    node.children?.forEach((child: any) => traverse(child, currentId));
  }

  traverse(root);

  dagreGraph.setGraph({
    rankdir: "TB",
    nodesep: 60,
    ranksep: 120,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const pos = dagreGraph.node(node.id);

    node.position = {
      x: pos.x - nodeWidth / 2,
      y: pos.y - nodeHeight / 2,
    };
  });

  return { nodes, edges };
}



export default function MindMap() {
  const [response, setResponse] = useState<any>(null);
  const [isArrived, setIsArrived] = useState<boolean>(false);

  useEffect(() => {
    getMindmap().then((res) => {
      setIsArrived(true);
      setResponse(res);

    });
  }, []);

  const { setSelectedOption } = useOption();
  const { theme } = useContext(ThemeContextData);
  const { nodes, edges } = useMemo(() => {
    if (!response?.mindmap?.mindMap) {
      return { nodes: [], edges: [] };
    }

    return buildGraph(response.mindmap.mindMap);
  }, [response]);

  return (
    <div className="h-screen text-black">
      {!isArrived ? (
        <LoadingPage classname={`${theme === "light"
          ? "text-black"
          : "text-white"
          }`} >
          ANALYZING MINDMAP
        </LoadingPage>

      ) : (
        <>

          <div className=" text-center m-3 ">
            <button
              onClick={() => { setSelectedOption("null") }}
              className={` px-5 py-1 rounded-sm font-bold   px-8 py-2 font-mono font-bold    hover:shadow-[6px_6px_0px_#000] transition rounded-none cursor-pointer
                                            ${theme == 'light' ?
                  " hover:shadow-[6px_6px_0px_#000] "
                  : "hover:shadow-[6px_6px_0px_#fff] "

                } ,
                                            ${theme === "light"
                  ? "bg-[#E9D6B4] shadow-[0px_0px_5px_#AD84AD]"
                  : "bg-[#066E76] text-[#E9D6B4]  "
                }
                              
                              
                              
                              `}>Switch Function</button>
          </div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            fitViewOptions={{
              padding: 0.3,
            }}
          >

            <Background />
            <Controls className="bg-black text-black" />
            {/* <MiniMap className="bg-black text-black" zoomable pannable /> */}
          </ReactFlow>
        </>
      )}
    </div>
  );
}