import Flashcard from "../models/Flashcard.js";

//desc get all flashcards for a docuement
//route /api/flashcards/:documentId
//access private

export const getFlashCards=async(req,res,next)=>{
try {
    const flashcards=await Flashcard.find({
        userId:req.user._id,
        documentId:req.params.documentId
    })
    .populate('documentId', 'title fileName')
    .sort({createdAt:-1})

    res.status(200).json({
        success:true,
        count:flashcards.length,
        data:flashcards
    })
} catch (error) {
    next(error)
}
}

//desc get all flashcards for a user
//route  get /api/flashcards/
//access private

export const getAllFlashcardSets=async(req,res,next)=>{
try {
    const flashcardSets=await Flashcard.find({userId:req.user._id})
    .populate('documentId','title')
    .sort({createdAt:-1})

    res.status(200).json({
        success:true,
        count:flashcardSets.length,
        data:flashcardSets
    })

} catch (error) {
    next(error)
}
}


//desc mark flashcard as reviewed
//route  post /api/flashcards/:cardId/review
//access privat


export const reviewFlashcard=async(req,res,next)=>{
try {
    const flashcardSet=await Flashcard.findOne({
        'cards._id':req.params.cardId,
        userId:req.user._id
    })

    if(!flashcardSet){
        return res.status(404).json({
            success:false,
            error:'Flashcard sets or card not found',
            statusCode:404
        })
    }
    const cardIndex=flashcardSet.cards.findIndex(cart=>card._id.toString()===req.params.cardId)

    if(cardIndex===-1){
        return res.status(404).json({
            success:false,
            error:"Card not found in set",
            statusCode:404
        })
    }

        //update review info

        flashcardSet.cards[cardIndex].lastReviewed=new Date();
          flashcardSet.cards[cardIndex].reviewCount+=1

          await flashcardSet.save()

          res.status(200).json({
            success:true,
            data:flashcardSet,
            message:'Flashcard rebiewed successfully'
          })
    
} catch (error) {
    next(error)
}
}
//desc toggle start/favourite on flashcard
//route  put /api/flashcards/:cardId/star
//access private

export const toggleStarFlashcard=async(req,res,next)=>{
try {
  const flashcardSet = await Flashcard.findOne({
    'cards._id': req.params.cardId,
    userId: req.user._id
  });

  if (!flashcardSet) {
    return res.status(404).json({
      success: false,
      error: 'Flashcard set or card not found',
      statusCode: 404
    });
  }

  const cardIndex = flashcardSet.cards.findIndex(card => card._id.toString() === req.params.cardId);

  if (cardIndex === -1) {
    return res.status(404).json({
      success: false,
      error: 'Card not found',
      statusCode: 404
    });
  }

  //toggle start
  flashcardSet.cards[cardIndex].isStarred=!flashcardSet.cards[cardIndex].isStarred

  await flashcardSet.save()

  res.status(200).json({
    success:true,
    data:flashcardSet,
    message:`Flashcard ${flashcardSet.cards[cardIndex].isStarred ? 'starred':'unstarred'}`
  })

  

} catch (error) {
 next(error)
}
}

//desc delete flashcard
//route  delete /api/flashcards/:id
//access private

export const deleteFlashcardSet=async(req,res,next)=>{
try {
  const flashcardSet = await Flashcard.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!flashcardSet) {
    return res.status(404).json({
      success: false,
      error: 'Flashcard set not found',
      statusCode: 404
    });
  }

  await flashcardSet.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Flashcard set deleted successfully'
  });

} catch (error) {
  next(error);
}
}


