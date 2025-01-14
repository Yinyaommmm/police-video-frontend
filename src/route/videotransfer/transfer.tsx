import { api } from "@/api";
import { LengthSelectors } from "@/route/videotransfer/components/length-selector";
import { TimeSelectors } from "@/route/videotransfer/components/time-selector";
import { TransferBoard } from "@/route/videotransfer/components/transfer-board";
import { VideoCard } from "@/route/videotransfer/components/video-card";
import { VideoNavBar } from "@/route/videotransfer/components/video-navbar";
import { $VT } from "@/store/videotransfer";
import { calcNeedTime, createTransferTNURL, throttle } from "@/utils";
import { useEffect, type FC } from "react";
import Modal from "./components/modal";

export enum CompleteStatus {
  ErrorHandled,
  Handling,
  AWaitHandling,
  Finished
}

export const Transfer: FC = () => {
  const currentPage = $VT.use((state) => state.curPage);
  const totalPage = $VT.use((state) => state.totalPage);
  const perPage = $VT.use(state => state.perPage)
  const videoCardArr = $VT.use(state => state.videoCardArray)
  const customTime = $VT.use(state => state.customTime)
  const customLength = $VT.use(state => state.lengthSelector)
  const fetchThumbnail = async () => {
    const currentPage = $VT.get().curPage
    const customTime = $VT.get().customTime
    const customLength = $VT.get().lengthSelector
    const res = await api.transfer.thumbnailList(currentPage, customTime, customLength)
    const caclTotalPage = Math.ceil(res.total_num / perPage)
    if (caclTotalPage !== totalPage) {
      $VT.update("change total", (state) => {
        state.totalPage = caclTotalPage
      })
    }
    $VT.update("update video", (state) => {
      state.videoCardArray = res.thumbnail_list.map(item => ({
        image: createTransferTNURL(item.url),
        name: item.filename,
        time: calcNeedTime(item.time)
      }))
    })
  };
  const videoStatus = $VT.use(state => state.videoStatus)
  const loadVideoStatus = async () => {
    const currentPage = $VT.get().curPage
    const customTime = $VT.get().customTime
    const customLength = $VT.get().lengthSelector
    const res = await api.transfer.handleStatus(currentPage, customTime, customLength)
    $VT.update("set video status", state => {
      state.videoStatus = res
    })
  }
  const setPageContent = throttle(async () => {
    await Promise.all([fetchThumbnail(), loadVideoStatus()])
  }, 500)

  useEffect(() => {
    setPageContent()
  }, [currentPage]);

  useEffect(() => {
    setPageContent()
    $VT.update('back to page 1', state => {
      state.curPage = 1
    })
  }, [customTime, customLength])
  useEffect(() => {
    setInterval(() => {
      setPageContent()
    }, 5000)
  }, [])

  // modal控制
  const showModal = $VT.use(state => state.showModal)
  const modalFileName = $VT.use(state => state.modalFileName)

  return (

    < div className="flex-grow relative mx-8 " >
      <VideoNavBar />
      <div id="video-container" className=" w-full h-4/5 rounded-lg">
        <div id="filter" className="text-white flex mx-5 mb-8 flex-col">
          <TimeSelectors />
          <LengthSelectors />
        </div>
        <div id="line " className="flex mb-5 flex-wrap w-[82vw] mx-auto ">
          {videoCardArr.map((card, index) => {
            let item = videoStatus.find(s => s.video_name === card.name)!
            if (item === undefined) {
              item = {
                completed: CompleteStatus.Unhandled,
                progress: 0,
                time_rest: 0,
                video_name: ''
              }
            }
            return <VideoCard key={card.name} time={card.time} imgSrc={card.image} title={card.name}
              complete={item.completed}
              progress={item.progress}
              estimate={item.time_rest}
              isLast={(index + 1) % 4 === 0} />
          })}

          <VideoCard
            complete={CompleteStatus.ErrorHandled}
            progress={0}
            isLast={true} />
        </div>

        <div id="pagination" className="w-full flex justify-center ">
          <button
            className={` font-bold bg-button_normal_background border-none rounded-xl min-w-24 h-[34px] mr-8 
              ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-button_hover_background"}`}
            onClick={() => {
              if (currentPage !== 1) {
                // todo : 请求上一页内容
                $VT.update("last page", (state) => {
                  state.curPage = state.curPage - 1;
                });
              }
            }}
          >
            上一页
          </button>
          <button className=" font-bold  bg-button_normal_background border-none rounded-xl min-w-12">
            {currentPage}
          </button>
          <button
            className={`font-bold bg-button_normal_background border-none rounded-xl min-w-24 h-[34px] ml-8 
              ${currentPage === totalPage ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-button_hover_background"}`}
            onClick={() => {
              if (currentPage !== totalPage) {
                // todo : 请求下一页内容
                console.log(totalPage, currentPage)
                $VT.update("last page", (state) => {
                  state.curPage = state.curPage + 1;
                });
              }
            }}
          >
            下一页
          </button>
        </div>
        <Modal
          title="确认删除此视频吗？该操作无法撤回"
          isOpen={showModal}
          onConfirm={async (e) => {
            e.stopPropagation()

            if (modalFileName !== "") {
              await api.transfer.deleteVideo(modalFileName)
              await setPageContent()
            }
            $VT.update('close modal', (state) => {
              state.showModal = false
              state.modalFileName = ""
            })
          }}
          onClose={(e) => {
            e.stopPropagation()
            $VT.update('close modal', (state) => {
              state.showModal = false
              state.modalFileName = ""
            })
          }}></Modal>
        <TransferBoard />
      </div>
    </div >
  );
};
